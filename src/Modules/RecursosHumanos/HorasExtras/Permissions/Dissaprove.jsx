import Disapprove from "../../../../components/Principal/Permissions/Disapprove";
import useSendMessage from "../../../../recicle/senMessage";
import { useAuth } from "../../../../context/AuthContext";
import axios from "../../../../api/axios";

const DissaproveHorasExtras = ({ setShowDisapprove, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const handleDisapprove = async () => {
        sendMessage("Rechazando horas extras...", "Cargando", true);
        try {
            if (selected.estado === "APROBADO") {
                sendMessage("Las horas extras ya han sido aprobadas.", "Advertencia");
                return;
            }
            if (!selected.colaborador) {
                sendMessage("No se encontró el colaborador asociado a las horas extras.", "Error");
                return;
            }
            const response = await axios.patch(`/rrhh/patchHorasExtras/`,
                {
                    _id: selected._id,
                    estado: "RECHAZADO",
                    rechazadoPor: user._id
                }
            );
            if (response.data.type === "Correcto") {
                sendMessage("Horas extras rechazadas exitosamente.", "Correcto");
            }
            reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setShowDisapprove(false);
        }
    }

    return (
        <Disapprove
            setShowDisapprove={setShowDisapprove}
            onclick={handleDisapprove}
            text={"Está seguro de querer rechazar"}
        >
        </Disapprove>
    )
}

export default DissaproveHorasExtras