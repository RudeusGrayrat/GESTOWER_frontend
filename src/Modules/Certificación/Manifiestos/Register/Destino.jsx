import { useState, useEffect } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";

const Paso5_Destino = ({ formData, setFormData }) => {
    const [destinoOptions, setDestinoOptions] = useState([]);

    const tipoManejoOptions = ["TRATAMIENTO", "DISPOSICIÓN FINAL", "VALORIZACIÓN"];

    const handleDestinoChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            destinoFinal: {
                ...prev.destinoFinal,
                [campo]: valor
            }
        }));
    };

    const handleOtrosManejosChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            otrosManejos: {
                ...prev.otrosManejos,
                [campo]: valor
            }
        }));
    };

    // Función para manejar el cambio de comercializable
    const handleComercializableChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            comercializable: checked,
            // Si se desactiva, resetear todos los campos de otrosManejos
            otrosManejos: checked ? prev.otrosManejos : {
                razonSocialReceptor: '',
                rucReceptor: '',
                correoReceptor: '',
                telefonoReceptor: '',
                comercializacion: false,
                exportacion: false,
                otro: false,
                tipoManejo: '',
                direccionDestino: '',
                documentoAprueba: '',
            }
        }));
    };

    // Si es SERVICIO TOWER, precargar datos de TOWER
    useEffect(() => {
        const cargarTowerDestino = async () => {
            if (formData.servicioTransporte === "SERVICIO TOWER") {
                try {
                    const response = await axios.get("/certificaciones/getDestinosPaginacion", {
                        params: { search: "TOWER" }
                    });
                    const towerDestino = response.data?.data?.find(t => t.razonSocial?.includes("TOWER"));
                    if (towerDestino) {
                        setFormData(prev => ({
                            ...prev,
                            destinoId: towerDestino
                        }));
                    }
                } catch (error) {
                    console.error("Error cargando destino TOWER:", error);
                }
            }
        };
        cargarTowerDestino();
    }, [formData.servicioTransporte, setFormData]);

    const isTowerService = formData.servicioTransporte === "SERVICIO TOWER";

    return (
        <div className="flex flex-wrap">
            <Input
                label="EO-RS Destino Final *"
                type="autocomplete"
                name="destinoId"
                value={formData.destinoId}
                setForm={setFormData}
                fetchData="/certificaciones/getDestinosPaginacion"
                setOptions={setDestinoOptions}
                options={destinoOptions}
                field="razonSocial"
                placeholder="Buscar destino por RUC o razón social"
                disabled={isTowerService}
            />

            <Input
                label="Tipo de Manejo *"
                type="select"
                name="tipoManejo"
                value={formData.tipoManejo}
                setForm={setFormData}
                options={tipoManejoOptions}
                placeholder="Seleccionar tipo de manejo"
            />

            <Input
                label="Cantidad entregada (toneladas) *"
                type="number"
                step="0.01"
                value={formData.destinoFinal?.cantidadEntregada || ""}
                onChange={(e) => handleDestinoChange('cantidadEntregada', e.target.value)}
                placeholder="Ej: 15.5"
            />

            <Input
                label="Observaciones"
                value={formData.destinoFinal?.observaciones || ""}
                onChange={(e) => handleDestinoChange('observaciones', e.target.value)}
                placeholder="Observaciones del destino final"
                ancho="w-full"
            />

            <div className="w-full mt-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Sección 3.3 - Otros Manejos</h3>

                <div className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={formData.comercializable || false}
                        onChange={(e) => handleComercializableChange(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">¿Es para comercialización?</span>
                </div>

                {formData.comercializable && (
                    <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                        <Input
                            label="Razón Social del Receptor"
                            value={formData.otrosManejos?.razonSocialReceptor || ""}
                            onChange={(e) => handleOtrosManejosChange('razonSocialReceptor', e.target.value.toUpperCase())}
                            placeholder="Razón social del receptor"
                        />

                        <Input
                            label="RUC del Receptor"
                            value={formData.otrosManejos?.rucReceptor || ""}
                            onChange={(e) => handleOtrosManejosChange('rucReceptor', e.target.value)}
                            placeholder="RUC"
                        />

                        <Input
                            label="Correo Electrónico"
                            type="email"
                            value={formData.otrosManejos?.correoReceptor || ""}
                            onChange={(e) => handleOtrosManejosChange('correoReceptor', e.target.value.toLowerCase())}
                            placeholder="correo@ejemplo.com"
                        />

                        <Input
                            label="Teléfono"
                            value={formData.otrosManejos?.telefonoReceptor || ""}
                            onChange={(e) => handleOtrosManejosChange('telefonoReceptor', e.target.value)}
                            placeholder="Teléfono"
                        />

                        <div className="col-span-2 grid grid-cols-3 gap-4">
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.otrosManejos?.comercializacion || false}
                                    onChange={(e) => handleOtrosManejosChange('comercializacion', e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Comercialización</span>
                            </div>

                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.otrosManejos?.exportacion || false}
                                    onChange={(e) => handleOtrosManejosChange('exportacion', e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Exportación</span>
                            </div>

                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.otrosManejos?.otro || false}
                                    onChange={(e) => handleOtrosManejosChange('otro', e.target.checked)}
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Otro</span>
                            </div>
                        </div>

                        <Input
                            label="Tipo de Manejo Realizado"
                            value={formData.otrosManejos?.tipoManejo || ""}
                            onChange={(e) => handleOtrosManejosChange('tipoManejo', e.target.value.toUpperCase())}
                            placeholder="Especifique el tipo de manejo"
                            ancho="w-full"
                        />

                        <Input
                            label="Dirección de Destino / País"
                            value={formData.otrosManejos?.direccionDestino || ""}
                            onChange={(e) => handleOtrosManejosChange('direccionDestino', e.target.value.toUpperCase())}
                            placeholder="Dirección o país de destino"
                            ancho="w-full"
                        />

                        <Input
                            label="Documento que Aprueba"
                            value={formData.otrosManejos?.documentoAprueba || ""}
                            onChange={(e) => handleOtrosManejosChange('documentoAprueba', e.target.value.toUpperCase())}
                            placeholder="N° de resolución o documento"
                            ancho="w-full"
                        />
                    </div>
                )}
            </div>

            <div className="w-full mt-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Sección 4.2 - Devolución del Manifiesto</h3>

                <div className="grid">
                    <h4 className="font-medium mb-2">Representante EO-RS (entrega)</h4>
                    <div className="border flex flex-wrap rounded-lg p-3">
                        <Input
                            label="Nombre"
                            value={formData.devolucionManifiesto?.representanteEors?.nombre || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    representanteEors: {
                                        ...prev.devolucionManifiesto?.representanteEors,
                                        nombre: e.target.value.toUpperCase()
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="DNI"
                            value={formData.devolucionManifiesto?.representanteEors?.dni || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    representanteEors: {
                                        ...prev.devolucionManifiesto?.representanteEors,
                                        dni: e.target.value
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="Cargo"
                            value={formData.devolucionManifiesto?.representanteEors?.cargo || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    representanteEors: {
                                        ...prev.devolucionManifiesto?.representanteEors,
                                        cargo: e.target.value.toUpperCase()
                                    }
                                }
                            }))}
                        />
                    </div>

                    <h4 className="font-medium mb-2">Responsable Generador (recibe)</h4>
                    <div className="border flex flex-wrap rounded-lg p-3">
                        <Input
                            label="Nombre"
                            value={formData.devolucionManifiesto?.responsableGenerador?.nombre || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    responsableGenerador: {
                                        ...prev.devolucionManifiesto?.responsableGenerador,
                                        nombre: e.target.value.toUpperCase()
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="DNI"
                            value={formData.devolucionManifiesto?.responsableGenerador?.dni || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    responsableGenerador: {
                                        ...prev.devolucionManifiesto?.responsableGenerador,
                                        dni: e.target.value
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="Cargo"
                            value={formData.devolucionManifiesto?.responsableGenerador?.cargo || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    responsableGenerador: {
                                        ...prev.devolucionManifiesto?.responsableGenerador,
                                        cargo: e.target.value.toUpperCase()
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="Fecha de Devolución"
                            type="date"
                            value={formData.devolucionManifiesto?.responsableGenerador?.fechaDevolucion || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    responsableGenerador: {
                                        ...prev.devolucionManifiesto?.responsableGenerador,
                                        fechaDevolucion: e.target.value
                                    }
                                }
                            }))}
                        />
                        <Input
                            label="Hora de Devolución"
                            type="time"
                            value={formData.devolucionManifiesto?.responsableGenerador?.horaDevolucion || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                devolucionManifiesto: {
                                    ...prev.devolucionManifiesto,
                                    responsableGenerador: {
                                        ...prev.devolucionManifiesto?.responsableGenerador,
                                        horaDevolucion: e.target.value
                                    }
                                }
                            }))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Paso5_Destino;