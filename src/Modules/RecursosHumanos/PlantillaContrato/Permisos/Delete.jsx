import Delete from "../../../../components/Principal/Permissions/Delete";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const DeletePlantillaContrato = ({ setShowDelete, selected, reload }) => {
  const sendMessage = useSendMessage();
  const onclick = async () => {
    try {
      await axios.delete(`/plantillas/${selected._id}`);
      reload?.();
      setShowDelete(false);
    } catch (error) {
      sendMessage(error.message, "Error");
    }
  };

  return <Delete setShowDelete={setShowDelete} onclick={onclick} />;
};

export default DeletePlantillaContrato;
