import Approve from "../../../../components/Principal/Permissions/Approve";

const AprobarManifiesto = ({ setShowApprove, selected }) => {
    const id = selected._id;
    const onclick = async () => {
        try {
            // Aquí puedes hacer la llamada a la API para aprobar el manifiesto
            // Por ejemplo:
            // await axios.post(`/certificaciones/aprobarManifiesto/${id}`);
            setShowApprove(false);
        } catch (error) {
            console.error("Error al aprobar el manifiesto:", error);
            // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
        }
    };
    return (
        <Approve onclick={onclick} setShowApprove={setShowApprove} />
    );
};

export default AprobarManifiesto;