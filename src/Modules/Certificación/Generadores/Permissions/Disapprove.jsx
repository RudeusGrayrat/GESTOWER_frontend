import axios from "../../../../api/axios";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../recicle/senMessage";

const DisapproveGenerador = ({ setShowDisapprove, selected, reload }) => {
    const sendMessage = useSendMessage();
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
            text="¿Suspender comercialmente este generador? Se bloquearán el acceso a ManifesTower, los nuevos manifiestos y los vínculos activos. El historial se conserva; podrás reactivarlo después desde el check."
        />
    );
};

export default DisapproveGenerador;
