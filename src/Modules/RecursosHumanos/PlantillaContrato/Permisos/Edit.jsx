import { useState } from "react";
import Edit from "../../../../components/Principal/Permissions/Edit";
import Datos from "../Register/Datos";
import useValidation from "../ValidatePlantilla";
import PopUp from "../../../../recicle/popUps";
import { deepDiff } from "../../../validateEdit";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const EditPlantillaContrato = ({ setShowEdit, selected, reload }) => {
  const [formData, setFormData] = useState({ ...selected });

  const { error } = useValidation();
  const formFinal = deepDiff(selected, formData);
  const sendMessage = useSendMessage();

  const upDate = async () => {
    sendMessage("Cargando...", "Espere");
    try {
      if (Object.keys(formFinal).length > 0) {
        const data = new FormData();
        data.append("nombre", formData.nombre);
        data.append("tipoContrato", formData.tipoContrato || "");
        data.append("state", formData.state);
        if (formData.archivo instanceof File) data.append("archivo", formData.archivo);
        const response = await axios.patch(`/plantillas/${selected._id}`, data);
        sendMessage(response.data.message, "Ok");
        reload?.();
        setShowEdit(false);
      } else {
        sendMessage("No se han realizado cambios", "Error");
      }
    } catch (error) {
      sendMessage(error || error.message, "Error");
    }
  };

  return (
    <Edit setShowEdit={setShowEdit} upDate={upDate}>
      <PopUp />
      <div className="flex h-full items-center justify-center">
        <Datos formData={formData} setFormData={setFormData} error={error} />
      </div>
    </Edit>
  );
};

export default EditPlantillaContrato;
