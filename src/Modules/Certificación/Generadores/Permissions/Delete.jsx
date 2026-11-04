import axios from "../../../../api/axios";
import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../recicle/senMessage";

const DeleteGenerador = ({ setShowDelete, selected, reload }) => {
    const sendMessage = useSendMessage();

    const eliminar = async () => {
        try {
            await axios.delete(`/certificaciones/deleteGenerador/${selected._id}`);
            sendMessage("Generador eliminado correctamente.", "Correcto");
            setShowDelete(false);
            reload?.();
        } catch (error) {
            sendMessage(error.response?.data?.message || "No se pudo eliminar el generador.", "Error");
        }
    };

    return <Delete setShowDelete={setShowDelete} onclick={eliminar} text={`¿Desea eliminar el generador ${selected?.razonSocial || "seleccionado"}?`} />;
};

export default DeleteGenerador;
