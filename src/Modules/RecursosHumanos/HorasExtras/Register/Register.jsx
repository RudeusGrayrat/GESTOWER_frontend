import { useState } from "react"
import CardPlegable from "../../../../recicle/Divs/CardPlegable"
import Input from "../../../../recicle/Inputs/Inputs"
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import InputNormal from "../../../../recicle/Inputs/tipos/Normal";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";

const RegisterHorasExtras = () => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [colaboradorOptions, setColaboradorOptions] = useState([])
    const [formData, setFormData] = useState({
        colaborador: "",
        fecha: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
        horas: 0,
        minutos: 0,
        motivo: "",
        minutosTotales: 0 // Este campo se usará para enviar el total de minutos al backend
    })

    const validate = () => {
        if (!formData.colaborador) {
            sendMessage("Debe seleccionar un colaborador", "Info");
            return false;
        }
        if (!formData.fecha) {
            sendMessage("Debe seleccionar una fecha", "Info");
            return false;
        }
        if (formData.horas === 0 && formData.minutos === 0) {
            sendMessage("Debe ingresar al menos 1 minuto de horas extras", "Info");
            return false;
        }
        if (!formData.motivo.trim()) {
            sendMessage("Debe ingresar un motivo", "Info");
            return false;
        }
        return true;
    }
    // Lógica mejorada para horas y minutos
    const handleHorasChange = (e) => {
        const horas = parseInt(e.target.value) || 0;
        // Validar que horas no exceda 24
        const horasValidas = Math.min(Math.max(horas, 0), 24);

        setFormData((prev) => {
            const nuevosDatos = {
                ...prev,
                horas: horasValidas,
                minutos: prev.minutos,
                minutosTotales: (horasValidas * 60) + prev.minutos
            };
            return nuevosDatos;
        });
    }

    const handleMinutosChange = (e) => {
        let minutos = parseInt(e.target.value) || 0;
        // Limitar minutos a 59 y no negativos
        minutos = Math.min(Math.max(minutos, 0), 59);

        setFormData((prev) => {
            const nuevosDatos = {
                ...prev,
                minutos: minutos,
                minutosTotales: (prev.horas * 60) + minutos
            };
            return nuevosDatos;
        });
    }

    // Función para limpiar el formulario
    const limpiarFormulario = () => {
        window.confirm("¿Está seguro de cancelar? Se perderán los datos ingresados.") && setFormData({
            colaborador: "",
            fecha: new Date().toISOString().split("T")[0],
            horas: 0,
            minutos: 0,
            motivo: "",
            asistenciaId: "",
            minutosTotales: 0
        });
    }
    const register = async () => {
        if (!validate()) return;
        setDeshabilitar(true);
        sendMessage("Registrando horas extras...", "Espere");
        try {
            const response = await axios.post("/rrhh/postHorasExtras", {
                colaborador: formData.colaborador._id,
                fecha: formData.fecha,
                horas: formData.horas,
                minutos: formData.minutos,
                motivo: formData.motivo,
                minutosTotales: formData.minutosTotales,
                creadoPor: user._id
            });
            if (response.data.type === "Correcto") {
                sendMessage(response.data.message, "Correcto");
                return setFormData({
                    colaborador: "",
                    fecha: new Date().toISOString().split("T")[0],
                    horas: 0,
                    minutos: 0,
                    motivo: "",
                    asistenciaId: "",
                    minutosTotales: 0
                });
            }
        } catch (error) {
            return sendMessage(error, "Error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <div className="p-4">
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Registro de Horas Extras">
                <div className="flex flex-wrap gap-4">
                    <Input
                        label="Colaborador"
                        name="colaborador"
                        type="autocomplete"
                        value={formData.colaborador}
                        setForm={setFormData}
                        fetchData={"/getEmployeeByParams"}
                        setOptions={setColaboradorOptions}
                        field={(item) => `${item.name} ${item.lastname}`}
                        options={colaboradorOptions}
                        required
                    />

                    <Input
                        label="Fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        setForm={setFormData}
                        required
                    />

                    <InputNormal
                        label="Horas"
                        name="horas"
                        type="number"
                        min="0"
                        max="24"
                        step="1"
                        value={formData.horas}
                        onChange={handleHorasChange}
                    />

                    <InputNormal
                        label="Minutos"
                        name="minutos"
                        type="number"
                        min="0"
                        max="59"
                        step="1"
                        value={formData.minutos}
                        onChange={handleMinutosChange}
                    />
                </div>

                {/* Mostrar total en minutos */}
                <div className="mt-4 p-3 bg-[#fafafa] rounded-md">
                    <p className="text-sm text-[#2a3747]">
                        <span className="font-semibold">Tiempo total:</span> {formData.horas} horas y {formData.minutos} minutos
                        ({formData.minutosTotales} minutos)
                    </p>
                </div>
            </CardPlegable>

            <CardPlegable title="Motivo de las Horas Extras" className="mt-4">
                <div className="flex flex-col mx-3 w-full">
                    <label className="text-base font-medium text-gray-700">
                        Describe el motivo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="mt-1 py-2 border px-3 w-full !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                        name="motivo"
                        placeholder="Ejemplo: Se requirió trabajar horas extras para completar un proyecto urgente debido a una fecha límite inminente."
                        value={formData.motivo}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                motivo: e.target.value
                            });
                        }}
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {formData.motivo.length}/500 caracteres
                    </div>
                </div>
            </CardPlegable>

            <div className="flex justify-center gap-4 mt-6">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-40"
                    onClick={limpiarFormulario}
                />
                <ButtonOk
                    type="ok"
                    children="Registrar"
                    classe="!w-40"
                    onClick={register}
                />
            </div>
        </div>
    )
}

export default RegisterHorasExtras