import { useState } from "react";
import useSendMessage from "../../../../recicle/senMessage";
import RegisterTransportistas from "../Register/Register";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../validateEdit";
import Edit from "../../../../components/Principal/Permissions/Edit";

const EditTransportistas = ({ setShowEdit, selected, reload }) => {
    const sendMessage = useSendMessage();
    const [formEdit, setFormEdit] = useState(selected);
    console.log("Datos originales:", selected);
    console.log("Datos editados:", formEdit);
    const diferencias = deepDiff(selected, formEdit);
    console.log("Diferencias detectadas:", diferencias);
    const upDate = async () => {
        sendMessage("Editando transportista...", "Espere", true);
        try {
            if (Object.keys(diferencias).length === 0) {
                sendMessage("No se han detectado cambios para actualizar", "Info");
                return;
            }
            if (diferencias.generadores) {
                diferencias.generadores = formEdit.generadores.map(gen => gen._id);
            }

            const response = await axios.patch(`/certificaciones/editTransportista/${formEdit._id}`, diferencias);
            if (response.data.type === "Correcto") {
                sendMessage("Transportista editado exitosamente", "Correcto");
                reload();
            }
        } catch (error) {
            sendMessage(error || "Error al editar el transportista", "error");
        } finally {
            setShowEdit(false);
        }
    }
    return (
        <Edit setShowEdit={setShowEdit} upDate={upDate}>
            <RegisterTransportistas editData={formEdit} setFormEdit={setFormEdit} />
        </Edit>
    )
}

export default EditTransportistas;