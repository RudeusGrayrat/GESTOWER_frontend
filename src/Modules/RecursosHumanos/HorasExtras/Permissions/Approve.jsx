import { useState } from "react";
import Approve from "../../../../components/Principal/Permissions/Approve"
import { useAuth } from "../../../../context/AuthContext";
import PopUp from "../../../../recicle/popUps"
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ApproveHorasExtras = ({ setShowApprove, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const handleApprove = async () => {
        setDeshabilitar(true);
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
                    estado: "APROBADO",
                    aprobadoPor: user._id
                }
            );
            if (response.data.type === "Correcto") {
                sendMessage("Horas extras aprobadas exitosamente.", "Correcto");
            }
            reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setShowApprove(false);
            setDeshabilitar(false);
        }
    }

    return (
        <Approve setShowApprove={setShowApprove} onclick={handleApprove} >
        </Approve>
    )
}

export default ApproveHorasExtras