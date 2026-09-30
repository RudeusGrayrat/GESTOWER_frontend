import ButtonOk from "../../../../recicle/Buttons/Buttons";
import PopUp from "../../../../recicle/popUps";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import { useState } from "react";
import useValidation from "../ValidatePlantilla";
import Datos from "./Datos";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const Register = () => {
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    tipoContrato: "",
    archivo: "",
    state: "ACTIVO",
  });

  const { error, validateForm } = useValidation(formData);

  const onclick = async () => {
    setDeshabilitar(true);
    try {
      const formIsValid = validateForm(formData);
      if (formIsValid) {
        const data = new FormData();
        data.append("nombre", formData.nombre);
        data.append("tipo", formData.tipo);
        data.append("tipoContrato", formData.tipoContrato);
        data.append("state", formData.state);
        data.append("archivo", formData.archivo);
        const response = await axios.post("/plantillas", data);
        sendMessage(response.data.message, "Ok");
        setFormData({ nombre: "", tipo: "", tipoContrato: "", archivo: "", state: "ACTIVO" });
      } else {
        sendMessage("Faltan datos", "Error");
      }
    } catch (error) {
      sendMessage(error.response?.data?.message || error.message, "Error");
    } finally {
      setDeshabilitar(false);
    }
  };
  return (
    <div className="flex flex-col w-full p-6">
      <PopUp deshabilitar={deshabilitar} />
      <CardPlegable title="Datos del Contrato">
        <Datos formData={formData} setFormData={setFormData} error={error} />
      </CardPlegable>
      <div>
        <ButtonOk type="ok" children="Guardar" onClick={onclick} />
      </div>
    </div>
  );
};

export default Register;
