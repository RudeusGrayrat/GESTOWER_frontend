import { useState } from "react";
import useSendMessage from "../../../../recicle/senMessage";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { deepDiff } from "../../../validateEdit";
import RegisterDestinos from "../Register/Register";

const EditDestino = ({ setShowEdit, selected, reload }) => {
    const sendMessage = useSendMessage();
    const [formEdit, setFormEdit] = useState(selected);
    console.log("Datos originales:", selected);
    console.log("Datos editados:", formEdit);
    const diferencias = deepDiff(selected, formEdit);
    console.log("Diferencias detectadas:", diferencias);
    const upDate = async () => {
        sendMessage("Editando destino...", "Espere", true);
        try {
            if (Object.keys(diferencias).length === 0) {
                sendMessage("No se han detectado cambios para actualizar", "Info");
                return;
            }
            if (diferencias.generadores) {
                diferencias.generadores = formEdit.generadores.map(gen => gen._id);
            }

            const response = await axios.patch(`/certificaciones/editDestino/${formEdit._id}`, diferencias);
            if (response.data.type === "Correcto") {
                sendMessage("Destino editado exitosamente", "Correcto");
                reload();
            }
        } catch (error) {
            sendMessage(error || "Error al editar el destino", "error");
        } finally {
            setShowEdit(false);
        }
    }
    return (
        <div
            className={`w-[90%]   h-[93%] bg-white  flex flex-col justify-center
            border-gray-100 border shadow-2xl fixed top-5 z-40 rounded-xl `}
        >
            <div className=" flex flex-col h-[90%] space-y-4 p-2 overflow-y-auto">
                <RegisterDestinos editData={formEdit} setFormEdit={setFormEdit} />
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

export default EditDestino;