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
                // Mapeamos los generadores para que conserven la estructura de objeto 
                // que requiere el sub-schema de Mongoose
                diferencias.generadores = formEdit.generadores.map(gen => {
                    // Validamos si generadorId viene populado (como objeto) o ya viene como string plano
                    const idLimpio = typeof gen.generadorId === 'object'
                        ? gen.generadorId?._id
                        : gen.generadorId;

                    return {
                        generadorId: idLimpio, // <-- Enviamos solo el string ID limpio aquí
                        tienePermisoLlenado: gen.tienePermisoLlenado ?? false // <-- Mantenemos su propiedad hermana
                    };
                });
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