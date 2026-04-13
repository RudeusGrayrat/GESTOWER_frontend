import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import RegisterHorasExtras from "../Register/Register";
import { deepDiff } from "../../../validateEdit";
import useSendMessage from "../../../../recicle/senMessage";
import { useAuth } from "../../../../context/AuthContext";
import axios from "../../../../api/axios";

const EditHorasExtras = ({ setShowEdit, selected, reload }) => {
    const [formEdit, setFormEdit] = useState(selected);
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const diferencias = deepDiff(selected, formEdit);
    const validate = () => {
        if (!formEdit.solicitante) {
            sendMessage("Debe seleccionar un solicitante", "Info");
            return false;
        }
        if (!formEdit.fecha) {
            sendMessage("Debe seleccionar una fecha", "Info");
            return false;
        }
        if (formEdit.colaboradores.length === 0) {
            sendMessage("Debe agregar al menos un colaborador con horas extras", "Info");
            return false;
        }
        if (!formEdit.retribucion) {
            sendMessage("Debe seleccionar una retribución", "Info");
            return false;
        }
        if (!formEdit.motivo.trim()) {
            sendMessage("Debe ingresar un motivo para las horas extras", "Info");
            return false;
        }

        return true;
    }

    const onclick = async () => {
        if (!validate()) return;
        sendMessage("Actualizando horas extras...", "Cargando", true);
        try {
            if (diferencias.length === 0) {
                sendMessage("No se han realizado cambios en el formulario.", "Info");
                return;
            }
            const newFormData = {
                _id: selected._id,
                estado: formEdit.estado,
                fecha: formEdit.fecha,
                modificadoPor: user._id,
                ...diferencias
            }
            const response = await axios.patch("/rrhh/patchHorasExtras/", newFormData);
            if (response.status > 200 || response.status < 400) {
                sendMessage(response.data.message, response.data.type);
                setShowEdit(false);
                return reload();
            }
        } catch (error) {
            sendMessage(error, "Error");
        }
    }

    return (
        <Edit setShowEdit={setShowEdit} upDate={onclick}>
            <RegisterHorasExtras editData={formEdit} setEditForm={setFormEdit} />
        </Edit>
    )
}

export default EditHorasExtras