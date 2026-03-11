import { useState } from "react";
import axios from "../../../../api/axios";
import Approve from "../../../../components/Principal/Permissions/Approve"
import PopUp from "../../../../recicle/popUps";
import useSendMessage from "../../../../recicle/senMessage";
import { useAuth } from "../../../../context/AuthContext";

const ApprovePermisos = ({ setShowApprove, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const [deshabilitar, setDeshabilitar] = useState(false);
    const handleApprove = async () => {
        setDeshabilitar(true);
        try {
            if (selected.estado === "APROBADO") {
                sendMessage("El permiso ya ha sido aprobado.", "Advertencia");
                return;
            }
            if (!selected.colaborador) {
                sendMessage("No se encontró el colaborador asociado al permiso.", "Error");
                return;
            }
            const response = await axios.patch(`/rrhh/patchPermiso/`,
                {
                    _id: selected._id,
                    estado: "APROBADO",
                    aprobadoPor: user._id
                }
            );
            if (response.data.type === "Correcto") {
                sendMessage("Permiso aprobado exitosamente.", "Correcto");
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
        <Approve setShowApprove={setShowApprove} onclick={handleApprove}
        >
            <PopUp deshabilitar={deshabilitar} />
        </Approve>
    )
}

export default ApprovePermisos