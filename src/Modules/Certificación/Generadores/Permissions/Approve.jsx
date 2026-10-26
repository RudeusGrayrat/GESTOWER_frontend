import axios from "../../../../api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve";
import useSendMessage from "../../../../recicle/senMessage";

const ApproveGenerador = ({ setShowApprove, selected, reload }) => {
    const sendMessage = useSendMessage();

    const aprobar = async () => {
        try {
            const { data } = await axios.post(`/manifesTower/generadores/${selected._id}/activar`);
            sendMessage(data.message, data.type || "Correcto");
            reload();
        } catch (error) {
            sendMessage(error.response?.data?.message || "No se pudo aprobar y activar el generador.", "Error");
        } finally {
            setShowApprove(false);
        }
    };

    return <Approve onclick={aprobar} setShowApprove={setShowApprove} />;
};

export default ApproveGenerador;
