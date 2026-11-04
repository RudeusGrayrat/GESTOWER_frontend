import axios from "../../../../api/axios";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../recicle/senMessage";

const DeleteTransportista = ({ setShowDelete, selected, reload }) => {
    const sendMessage = useSendMessage();

    const eliminar = async () => {
        try {
            await axios.delete(`/certificaciones/deleteTransportista/${selected._id}`);
            sendMessage("Transportista eliminado correctamente.", "Correcto");
            setShowDelete(false);
            reload?.();
        } catch (error) {
            sendMessage(error.response?.data?.message || "No se pudo eliminar el transportista.", "Error");
        }
    };

    return <Delete setShowDelete={setShowDelete} onclick={eliminar} text={`¿Desea eliminar el transportista ${selected?.razonSocial || "seleccionado"}?`} />;
};

export default DeleteTransportista;
