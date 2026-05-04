import axios from "../../../../api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve";
import { useAuth } from "../../../../context/AuthContext";
import useSendMessage from "../../../../recicle/senMessage";

const ApproveMovimiento = ({ setShowApprove, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth()
    const aprobar = async () => {
        sendMessage("Aprobando movimiento", "Enviando...", true);
        try {
            const payload = {
                _id: selected._id,
                estado: "APROBADO",
                aprobadoPor: user._id,
                actualizadoPor: user._id
            }
            const response = await axios.patch("/patchMovimientoAlmacen", payload);
            console.log("🚀 ~ file: ApproveMovimiento.jsx:20 ~ aprobar ~ response:", response)
            if (response.status < 300) {
                sendMessage(response.data?.message, response.data?.type);
                reload();
            }
        } catch (error) {
            sendMessage(error, "Error");
        }
    }

    return (
        <Approve setShowApprove={setShowApprove} onclick={aprobar} />
    )
}

export default ApproveMovimiento;                                                               