import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable"
import Input from "../../../../recicle/Inputs/Inputs";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";

const RegisterPermisos = () => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [colaboradorOptions, setColaboradorOptions] = useState([])

    const [formData, setFormData] = useState({
        colaborador: "",
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaFin: new Date().toISOString().split("T")[0],
        duracionHoras: 0,
        tipo: "MEDICO",
        motivo: "",
        conGoce: false
    })
    const validate = () => {
        if (!formData.colaborador) {
            sendMessage("Debe seleccionar un colaborador", "Info");
            return false;
        }
        if (!formData.fechaInicio) {
            sendMessage("Debe seleccionar una fecha de inicio", "Info");
            return false;
        }
        if (!formData.fechaFin) {
            sendMessage("Debe seleccionar una fecha de fin", "Info");
            return false;
        }
        if (formData.duracionHoras <= 0) {
            sendMessage("La duración en horas debe ser mayor a 0", "Info");
            return false;
        }
        if (!formData.motivo.trim()) {
            sendMessage("Debe ingresar un motivo", "Info");
            return false;
        }
        return true;
    }
    const limpiarFormulario = () => {
        window.confirm("¿Está seguro de cancelar? Se perderán los datos ingresados.") && setFormData({
            colaborador: "",
            fechaInicio: new Date().toISOString().split("T")[0],
            fechaFin: new Date().toISOString().split("T")[0],
            duracionHoras: 0,
            tipo: "MEDICO",
            motivo: "",
            conGoce: false
        });
    };
    const register = async () => {
        if (!validate()) return;
        setDeshabilitar(true);
        sendMessage("Enviando solicitud...", "Espere");
        try {
            const response = await axios.post("/rrhh/postPermiso", {
                colaborador: formData.colaborador._id,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                duracionHoras: formData.duracionHoras,
                tipo: formData.tipo,
                motivo: formData.motivo,
                conGoce: formData.conGoce,
                creadoPor: user._id
            });
            if (response.data.type === "Correcto") {
                sendMessage("Permiso registrado exitosamente", "Correcto");
                return setFormData({
                    colaborador: "",
                    fechaInicio: new Date().toISOString().split("T")[0],
                    fechaFin: new Date().toISOString().split("T")[0],
                    duracionHoras: 0,
                    tipo: "MEDICO",
                    motivo: "",
                    conGoce: false
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
            <CardPlegable title={"Datos del Permiso"} >
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
                        label="Fecha Inicio"
                        name="fechaInicio"
                        type="date"
                        value={formData.fechaInicio}
                        setForm={setFormData}
                        required
                    />
                    <Input
                        label="Fecha Fin"
                        name="fechaFin"
                        type="date"
                        value={formData.fechaFin}
                        setForm={setFormData}
                        required
                    />
                    <Input
                        label="Duración en Horas"
                        name="duracionHoras"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.duracionHoras}
                        setForm={setFormData}
                        required
                    />
                    <Input
                        label="Tipo de Permiso"
                        name="tipo"
                        type="select"
                        value={formData.tipo}
                        setForm={setFormData}
                        options={["MEDICO", "PERSONAL", "METERNIDAD", "VACACIONES", "ESTUDIOS", "OTRO"]}
                        required
                    />
                    <Input
                        label="Con Goce de Sueldo"
                        name="conGoce"
                        type="checkbox"
                        value={formData.conGoce}
                        setForm={setFormData}
                    />
                </div>
            </CardPlegable>
            <CardPlegable title="Motivo del Permiso" className="mt-4">
                <div className="flex flex-col mx-3 w-full">
                    <label className="text-base font-medium text-gray-700">
                        Describe el motivo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="mt-1 py-2 border px-3 w-full !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                        name="motivo"
                        placeholder="Ejemplo: Se dió permiso por motivos personales para atender asuntos familiares urgentes."
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

export default RegisterPermisos