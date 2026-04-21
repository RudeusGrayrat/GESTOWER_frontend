import axios from "../../../../api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import { useAuth } from "../../../../context/AuthContext";
import useSendMessage from "../../../../recicle/senMessage";

const RechazarManifiesto = ({ setShowDisapprove, selected, reload }) => {
    const id = selected._id;
    const { user } = useAuth();
    const sendMessage = useSendMessage();
    const onclick = async () => {
        try {
            const response = await axios.patch(`/certificaciones/editManifiesto/${id}`, {
                estado: "RECHAZADO",
                rechazadoPor: user._id,
            });
            if (response.status >= 200 && response.status < 400) {
                sendMessage(response.data.message, response.data.type);
                reload(); // Recargar los datos después de rechazar el manifiesto
            }
        } catch (error) {
            sendMessage(error || "Error al rechazar el manifiesto", "Error");
        } finally {
            setShowDisapprove(false);
        }
    };
    return (
        <Disapprove onclick={onclick}
            text="¿Está seguro que desea rechazar este manifiesto?"
            setShowDisapprove={setShowDisapprove} />
    );
};

export default RechazarManifiesto;