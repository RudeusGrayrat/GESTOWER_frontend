import { useState } from "react";
import Register from "../../../../components/Principal/Register/Register";
import DatosSedes from "./Datos";
import useValidation from "./Validate";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import { useAuth } from "../../../../context/AuthContext";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";

const RegisterSedesAlmacen = () => {
  const { postSedesAlmacen } = useAuth();
  const sendMessage = useSendMessage();
  const [habilitar, setHabilitar] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    estado: "ACTIVO",
  });
  const { error, validateForm } = useValidation();
  const enviar = async () => {
    const isValid = validateForm(form);
    setHabilitar(true);
    sendMessage("Registrando sede...", "Espere", true);
    if (!isValid) {
      sendMessage("Faltan datos", "Error");
      return;
    }
    try {
      await postSedesAlmacen(form);
    } catch (error) {
      sendMessage(error.message, "Error");
    } finally {
      setHabilitar(false);
    }
  };
  const resetForm = () => {
    setForm({
      nombre: "",
      direccion: "",
      ciudad: "",
      estado: "ACTIVO",
    });
  };
  return (
    <div className="flex flex-col w-full p-6">

      <CardPlegable title="Registrar Sede Almacen">
        <DatosSedes form={form} setForm={setForm} error={error} />
      </CardPlegable>
      <div className="flex justify-center ">
        <ButtonOk
          children="Cancelar"
          classe="!w-32"
          onClick={() => resetForm()}
        />
        <ButtonOk
          type="ok"
          onClick={enviar}
          classe="!w-32"
          children="Registrar"
        />
      </div>
    </div>
  );
};

export default RegisterSedesAlmacen;
