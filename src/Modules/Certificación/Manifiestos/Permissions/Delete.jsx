import axios from "../../../../api/axios";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../recicle/senMessage";

const DeleteManifiesto = ({ setShowDelete, selected, reload }) => {
    const sendMessage = useSendMessage();

    const eliminar = async () => {
        try {
            await axios.delete(`/certificaciones/deleteManifiesto/${selected._id}`);
            sendMessage("Manifiesto eliminado correctamente.", "Correcto");
            setShowDelete(false);
            reload?.();
        } catch (error) {
            sendMessage(error.response?.data?.message || "No se pudo eliminar el manifiesto.", "Error");
        }
    };

    return <Delete setShowDelete={setShowDelete} onclick={eliminar} text={`¿Desea eliminar el manifiesto ${selected?.numeroManifiesto || "seleccionado"}?`} />;
};

export default DeleteManifiesto;
