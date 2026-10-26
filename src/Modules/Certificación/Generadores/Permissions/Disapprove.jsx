import axios from "../../../../api/axios";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../recicle/senMessage";

const DisapproveGenerador = ({ setShowDisapprove, selected, reload }) => {
    const sendMessage = useSendMessage();
    const esPendiente = selected.estado === "PENDIENTE";

    const ejecutar = async () => {
        try {
            const { data } = await axios.post(`/manifesTower/generadores/${selected._id}/desaprobar`);
            sendMessage(data.message, data.type || "Correcto");
            reload();
        } catch (error) {
            sendMessage(error.response?.data?.message || "No se pudo actualizar el estado del generador.", "Error");
        } finally {
            setShowDisapprove(false);
        }
    };

    return (
        <Disapprove
            setShowDisapprove={setShowDisapprove}
            onclick={ejecutar}
            text={esPendiente
                ? "¿Rechazar este registro? La cuenta y su vínculo no podrán utilizarse."
                : "¿Suspender este generador? Se bloqueará ManifesTower y los nuevos envíos; el historial se conservará."}
        />
    );
};

export default DisapproveGenerador;
