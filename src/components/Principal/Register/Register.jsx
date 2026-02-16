import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/actions";
import PopUp from "../../../recicle/popUps";
import ButtonOk from "../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../recicle/senMessage";
import { useState } from "react";

const Register = ({ validate, registrar, children, resetForm }) => {
  const sendMessage = useSendMessage();
  const [habilitar, setHabilitar] = useState(false);
  const enviar = async () => {
    try {
      const validation = validate();
      setHabilitar(true);
      if (!validation) {
        sendMessage("Faltan datos", "Error");
      } else {
        await registrar();
        if (resetForm) resetForm();
      }
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    } finally {
      setHabilitar(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      <PopUp deshabilitar={habilitar} />
      {children}
      <div className="flex justify-center">
        {resetForm && (
          <ButtonOk
            children="Cancelar"
            classe="!w-32"
            onClick={() => resetForm()}
          />
        )}
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

export default Register;
