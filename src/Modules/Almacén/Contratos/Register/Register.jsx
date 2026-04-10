import { useEffect, useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import useValidation from "../validateContract";
import DatosBasicos from "./DatosBasicos";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import { useAuth } from "../../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllSedesAlmacen } from "../../../../redux/modules/Almacen/actions";

const RegisterContractalmacen = () => {
  const { postContratoAlmacen } = useAuth();
  const allSedes = useSelector((state) => state.almacen.allSedes) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    if (allSedes.length === 0) {
      dispatch(getAllSedesAlmacen());
    }
  }, [allSedes, dispatch]);
  const sedesName = allSedes?.map((sede) => sede.nombre);
  const [form, setForm] = useState({
    cliente: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "ACTIVO",
  });
  const sendMessage = useSendMessage();
  const resetForm = () => {
    setForm({
      cliente: "",
      sede: "",
      fechaInicio: "",
      fechaFin: "",
      estado: "ACTIVO",
    });
  };
  const { error, validateForm } = useValidation();
  const register = async () => {
    try {
      const isValid = await validateForm(form);
      if (!isValid) {
        sendMessage(
          "Por favor, completa todos los campos requeridos.",
          "Error"
        );
        return;
      }
      const findSede = allSedes?.find((sede) => sede.nombre === form.sede);
      if (!findSede) {
        sendMessage("Sede no encontrada.", "Error");
        return;
      }
      await postContratoAlmacen({ ...form, sedeId: findSede._id });
    } catch (error) {
      sendMessage(error.message, "Error");
    }
  };
  return (
    <div className="flex flex-col w-full p-6">
      <CardPlegable title="Registrar Contrato de Almacén">
        <DatosBasicos
          form={form}
          setForm={setForm}
          error={error}
          sedes={sedesName}
        />
      </CardPlegable>
      <div className="flex justify-center ">
        <ButtonOk
          children="Cancelar"
          classe="!w-32"
          onClick={() => resetForm()}
        />
        <ButtonOk
          type="ok"
          onClick={register}
          classe="!w-32"
          children="Registrar"
        />
      </div>
    </div>
  );
};

export default RegisterContractalmacen;
