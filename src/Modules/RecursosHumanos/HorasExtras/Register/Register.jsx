import { useState } from "react"
import CardPlegable from "../../../../recicle/Divs/CardPlegable"
import Input from "../../../../recicle/Inputs/Inputs"
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import InputNormal from "../../../../recicle/Inputs/tipos/Normal";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import Colaboradores from "./Colaboradores";

const RegisterHorasExtras = ({ editData, setEditForm }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        solicitante: user || "",
        fecha: new Date().toISOString().split("T")[0],
        retribucion: "PAGO",
        formaCompensacion: "",
        colaboradores: [],
        motivo: "",
    })
    console.log("Form data state:", formData);
    const validate = () => {
        if (!formData.solicitante) {
            sendMessage("Debe seleccionar un solicitante", "Info");
            return false;
        }
        if (!formData.fecha) {
            sendMessage("Debe seleccionar una fecha", "Info");
            return false;
        }
        if (formData.colaboradores.length === 0) {
            sendMessage("Debe agregar al menos un colaborador con horas extras", "Info");
            return false;
        }
        if (!formData.retribucion) {
            sendMessage("Debe seleccionar una retribución", "Info");
            return false;
        }
        if (!formData.motivo.trim()) {
            sendMessage("Debe ingresar un motivo para las horas extras", "Info");
            return false;
        }

        return true;
    }

    const limpiarFormulario = () => {
        setFormData({
            solicitante: user || "",
            fecha: new Date().toISOString().split("T")[0],
            retribucion: "PAGO",
            formaCompensacion: "",
            motivo: "",
            colaboradores: [],
        });
    }
    const register = async () => {
        if (!validate()) return;
        sendMessage("Registrando horas extras...", "Espere", true);
        try {
            const response = await axios.post("/rrhh/postHorasExtras", {
                ...formData,
                solicitante: formData.solicitante._id,
                estado: "PENDIENTE",
                creadoPor: user._id
            });
            if (response.status > 200 || response.status < 400) {
                sendMessage(response.data.message, response.data.type);
                return limpiarFormulario();
            }
        } catch (error) {
            return sendMessage(error, "Error");
        }
    }
    return (
        <div className="grid gap-2">
            <CardPlegable title="Solicitante y Detalles de las Horas Extras">
                <div className="flex flex-wrap">
                    <Input
                        label="Solicitante"
                        name="solicitante"
                        type="autocomplete"
                        value={editData ? editData.solicitante : formData.solicitante}
                        ancho="!min-w-96"
                        field={(item) => `${item.name} ${item.lastname}`}
                        disabled
                        required
                    />
                    <Input
                        label="Fecha"
                        name="fecha"
                        type="date"
                        ancho="!min-w-36"
                        value={editData ? editData.fecha : formData.fecha}
                        setForm={setEditForm ? setEditForm : setFormData}
                        required
                    />
                    <Input
                        label="Retribución"
                        name="retribucion"
                        type="select"
                        ancho="!min-w-36 !w-48"
                        value={editData ? editData.retribucion : formData.retribucion}
                        setForm={setEditForm ? setEditForm : setFormData}
                        options={["PAGO", "COMPENSACIÓN"]}
                        required
                    />
                    <InputNormal
                        label="Forma de compensación (si aplica)"
                        placeholder="Ejemplo: Días libres, pago adicional, etc."
                        name="formaCompensacion"
                        type="text"
                        ancho="!min-w-96"
                        value={editData ? editData.formaCompensacion : formData.formaCompensacion}
                        setForm={setEditForm ? setEditForm : setFormData}
                    />
                    <div className="flex flex-col mx-3 w-full">
                        <label className="text-base font-medium text-gray-700">
                            Describe el motivo <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="mt-1 py-2 border px-3 w-full !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                            name="motivo"
                            placeholder="Ejemplo: Se requirió trabajar horas extras para completar un proyecto urgente debido a una fecha límite inminente."
                            value={editData ? editData.motivo : formData.motivo}
                            onChange={setEditForm ? (e) => setEditForm({ ...editData, motivo: e.target.value }) : (e) => {
                                setFormData({
                                    ...formData,
                                    motivo: e.target.value
                                });
                            }}
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {editData ? editData.motivo.length : formData.motivo.length}/500 caracteres
                        </div>
                    </div>
                </div>
            </CardPlegable>
            <CardPlegable title="Registro de Horas Extras">
                <Directorio
                    ItemComponent={Colaboradores}
                    data="colaboradores"
                    estilos=" flex justify-center items-center"
                    directory={editData ? editData.colaboradores : formData.colaboradores}
                    setForm={setEditForm ? setEditForm : setFormData}
                />
            </CardPlegable>

            {!editData && (<div className="flex justify-center gap-4">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-60 !p-3 !text-xl"
                    onClick={limpiarFormulario}
                />
                <ButtonOk
                    type="ok"
                    children="Registrar"
                    classe="!w-60 !p-3 !text-xl"
                    onClick={register}
                />
            </div>)}
        </div>
    )
}

export default RegisterHorasExtras