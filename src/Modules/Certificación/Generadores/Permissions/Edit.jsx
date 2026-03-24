import { useState } from "react";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import PopUp from "../../../../recicle/popUps";
import Register from "../Register/Register";
import { deepDiff } from "../../../validateEdit";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const EditGenerador = ({ setShowEdit, selected, reload }) => {
    const [deshabilitar, setDeshabilitar] = useState(false);
    console.log("Selected para editar:", selected);
    const [editForm, setEditForm] = useState(selected);
    const sendMessage = useSendMessage();
    const changes = deepDiff(selected, editForm);
    const upDate = async () => {
        setDeshabilitar(true);
        try {
            sendMessage("Editando generador...", "Espere", true);
            if (Object.keys(changes).length === 0) {
                sendMessage("No se han detectado cambios para actualizar", "info");
                return;
            }

            // ✅ Todo ya viene en base64 desde InputFile — enviar directo
            const response = await axios.patch(
                `/certificaciones/editGenerador/${selected._id}`,
                changes
            );

            if (response.data.type === "Correcto") {
                sendMessage("Generador editado exitosamente", "Correcto");
                reload();
            }
        } catch (error) {
            sendMessage(error || "Error al editar el generador", "error");
        } finally {
            setDeshabilitar(false);
        }
    }
    return (
        <div className="w-[90%]   h-[93%] bg-white  flex flex-col justify-center
        border-gray-100 border shadow-2xl fixed top-5 z-40 rounded-xl">
            <div className=" flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
                <Register editForm={editForm} setEditForm={setEditForm} />
            </div>
            <div className="flex justify-end border-t ">
                <ButtonOk
                    onClick={() => setShowEdit(false)}
                    classe="w-32"
                    children="Cancelar"
                />
                <ButtonOk onClick={upDate} type="ok" classe="w-32" children="Editar" />
            </div>
        </div>
    )
}

export default EditGenerador;