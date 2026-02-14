import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Input from "../../../../recicle/Inputs/Inputs";
import useSendMessage from "../../../../recicle/senMessage";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import * as XLSX from 'xlsx'; // npm install xlsx
import PopUp from "../../../../recicle/popUps";

const RegisterUbigeo = () => {
    const sendMessage = useSendMessage();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [modoRegistro, setModoRegistro] = useState('manual'); // 'manual' o 'archivo'
    const [archivo, setArchivo] = useState(null);
    const [form, setForm] = useState({
        codigo: "",
        departamento: "",
        provincia: "",
        distrito: "",
        regionNatural: "",
        estado: "ACTIVO"
    });

    const resetForm = () => {
        setForm({
            codigo: "",
            departamento: "",
            provincia: "",
            distrito: "",
            regionNatural: "",
            estado: "ACTIVO"
        });
        setArchivo(null);
    };

    // Registrar un solo ubigeo manualmente
    const registerManual = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando ubigeo...", "Cargando");
        try {
            // Validaciones mejoradas
            if (!form.codigo || !form.departamento || !form.provincia || !form.distrito) {
                sendMessage("Todos los campos son obligatorios", "Advertencia");
                return;
            }

            // Validar formato del código (6 dígitos)
            if (!/^\d{6}$/.test(form.codigo)) {
                sendMessage("El código debe tener 6 dígitos numéricos", "Advertencia");
                return;
            }

            const response = await axios.post("/certificaciones/postUbigeo", form);
            const responseData = response.data;

            if (responseData.type === "Correcto") {
                sendMessage("Ubigeo registrado exitosamente", "Correcto");
                resetForm();
            } else {
                sendMessage(responseData.message, responseData.type || "Error");
            }
        } catch (error) {
            sendMessage(error.response?.data?.message || "Error al registrar el ubigeo", "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    // Procesar archivo Excel/JSON
    const procesarArchivo = async () => {
        if (!archivo) {
            sendMessage("Por favor, seleccione un archivo", "Advertencia");
            return;
        }

        setDeshabilitar(true);
        sendMessage("Procesando archivo...", "Cargando");

        try {
            let ubigeos = [];

            // Procesar según el tipo de archivo
            if (archivo.name.endsWith('.json')) {
                // Archivo JSON
                const text = await archivo.text();
                ubigeos = JSON.parse(text);
            } else if (archivo.name.endsWith('.xlsx') || archivo.name.endsWith('.xls')) {
                // Archivo Excel
                const data = await archivo.arrayBuffer();
                const workbook = XLSX.read(data);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                ubigeos = XLSX.utils.sheet_to_json(worksheet);
            } else {
                sendMessage("Formato de archivo no soportado. Use JSON o Excel", "Advertencia");
                return;
            }

            // Validar y transformar datos
            const ubigeosValidos = [];
            const errores = [];

            for (let i = 0; i < ubigeos.length; i++) {
                const item = ubigeos[i];

                // Mapear según el formato del Excel que me compartiste
                const ubigeo = {
                    codigo: String(item.CÓDIGO || item.codigo || '').padStart(6, '0'),
                    departamento: item.DEPARTAMENTO || item.departamento || '',
                    provincia: item.PROVINCIA || item.provincia || '',
                    distrito: item.DISTRITO || item.distrito || '',
                    regionNatural: item.REGION_NATURAL || item.regionNatural || item['REGION NATURAL'] || '',
                    estado: "ACTIVO"
                };

                // Validar campos obligatorios
                if (!ubigeo.codigo || !ubigeo.departamento || !ubigeo.provincia || !ubigeo.distrito) {
                    errores.push(`Fila ${i + 2}: Faltan campos obligatorios`);
                    continue;
                }

                // Validar formato del código
                if (!/^\d{6}$/.test(ubigeo.codigo)) {
                    errores.push(`Fila ${i + 2}: Código inválido (${ubigeo.codigo})`);
                    continue;
                }

                ubigeosValidos.push(ubigeo);
            }

            if (ubigeosValidos.length === 0) {
                sendMessage("No hay datos válidos para procesar", "Advertencia");
                return;
            }

            // Enviar en lotes de 100 para no sobrecargar el servidor
            const resultados = [];
            for (let i = 0; i < ubigeosValidos.length; i += 100) {
                const lote = ubigeosValidos.slice(i, i + 100);
                const response = await axios.post("/certificaciones/postUbigeosBatch", { ubigeos: lote });
                resultados.push(...response.data.resultados);
            }

            const exitosos = resultados.filter(r => r.success).length;
            const fallidos = resultados.filter(r => !r.success).length;

            sendMessage(
                `Procesados: ${ubigeosValidos.length} ubigeos. Exitosos: ${exitosos}, Fallidos: ${fallidos}`,
                fallidos === 0 ? "Correcto" : "Advertencia"
            );

            resetForm();
        } catch (error) {
            console.error("Error procesando archivo:", error);
            sendMessage("Error al procesar el archivo: " + error.message, "Error");
        } finally {
            setDeshabilitar(false);
        }
    };

    return (
        <div className="w-full p-4">
            {/* Selector de modo */}
            <PopUp deshabilitar={deshabilitar} />
            <div className="flex justify-center mb-4 space-x-4">
                <button
                    className={`px-4 py-2 rounded ${modoRegistro === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setModoRegistro('manual')}
                >
                    Registro Manual
                </button>
                <button
                    className={`px-4 py-2 rounded ${modoRegistro === 'archivo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setModoRegistro('archivo')}
                >
                    Carga Masiva
                </button>
            </div>

            {modoRegistro === 'manual' ? (
                // MODO MANUAL
                <CardPlegable title="Registro Manual de Ubigeo">
                    <div className="flex flex-wrap">
                        <Input
                            label="Código (6 dígitos) *"
                            name="codigo"
                            value={form.codigo}
                            setForm={setForm}
                            maxLength={6}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Ej: 150101"
                        />
                        <Input
                            label="Departamento *"
                            name="departamento"
                            value={form.departamento}
                            setForm={setForm}
                            placeholder="Ej: LIMA"
                        />
                        <Input
                            label="Provincia *"
                            name="provincia"
                            value={form.provincia}
                            setForm={setForm}
                            placeholder="Ej: LIMA"
                        />
                        <Input
                            label="Distrito *"
                            name="distrito"
                            value={form.distrito}
                            setForm={setForm}
                            placeholder="Ej: LIMA"
                        />
                        <Input
                            label="Región Natural"
                            name="regionNatural"
                            value={form.regionNatural}
                            setForm={setForm}
                            placeholder="Ej: COSTA, SIERRA, SELVA"
                        />
                    </div>
                </CardPlegable>
            ) : (
                // MODO CARGA MASIVA
                <CardPlegable title="Carga Masiva de Ubigeos">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Puedes subir un archivo Excel (.xlsx, .xls) o JSON con la siguiente estructura:
                        </p>

                        {/* Vista previa del formato */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Formato esperado (Excel):</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="p-2">CÓDIGO</th>
                                            <th className="p-2">DEPARTAMENTO</th>
                                            <th className="p-2">PROVINCIA</th>
                                            <th className="p-2">DISTRITO</th>
                                            <th className="p-2">REGION NATURAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2">010101</td>
                                            <td className="p-2">AMAZONAS</td>
                                            <td className="p-2">CHACHAPOYAS</td>
                                            <td className="p-2">CHACHAPOYAS</td>
                                            <td className="p-2">SIERRA</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2">150101</td>
                                            <td className="p-2">LIMA</td>
                                            <td className="p-2">LIMA</td>
                                            <td className="p-2">LIMA</td>
                                            <td className="p-2">COSTA</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Selector de archivo */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar archivo
                            </label>
                            <input
                                type="file"
                                accept=".json,.xlsx,.xls"
                                onChange={(e) => setArchivo(e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>

                        {archivo && (
                            <div className="text-sm text-gray-600">
                                Archivo seleccionado: {archivo.name}
                            </div>
                        )}
                    </div>
                </CardPlegable>
            )}

            {/* Botones */}
            <div className="flex justify-center mt-6">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-32 mr-4"
                    onClick={resetForm}
                    disabled={deshabilitar}
                />
                <ButtonOk
                    type="ok"
                    onClick={modoRegistro === 'manual' ? registerManual : procesarArchivo}
                    classe="!min-w-32"
                    children={modoRegistro === 'manual' ? "Registrar" : "Procesar Archivo"}
                    disabled={deshabilitar}
                />
            </div>
        </div>
    );
};

export default RegisterUbigeo;