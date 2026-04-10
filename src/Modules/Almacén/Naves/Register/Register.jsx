import { useEffect, useState } from "react";
import DatosBasicos from "./DatosBasicos";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { useDispatch, useSelector } from "react-redux";
import { getAllSedesAlmacen } from "../../../../redux/modules/Almacen/actions";
import { useAuth } from "../../../../context/AuthContext";

const RegisterNaves = () => {
  const { postNavesAlmacen } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    sede: "",
    descripcion: "",
  });
  const dispatch = useDispatch();
  const allSedes = useSelector((state) => state.almacen.allSedes);
  const sedesName = allSedes.map((sede) => sede.nombre);
  const recargar = () => {
    dispatch(getAllSedesAlmacen());
  };
  useEffect(() => {
    if (allSedes.length === 0) {
      recargar();
    }
  }, [allSedes, dispatch]);
  const [deshabilitar, setDeshabilitar] = useState(false);
  const sendMessage = useSendMessage();
  const register = async () => {
    if (!form.nombre || !form.sede) {
      return sendMessage("El Nombre y Sede son obligatorios", "Error");
    }
    setDeshabilitar(true);
    sendMessage("Registrando nave...", "Espere", true);
    try {
      const findSede = allSedes?.find((sede) => sede.nombre === form.sede);
      if (!findSede) {
        return sendMessage("Sede no encontrada", "Error");
      }
      const newForm = {
        ...form,
        sedeId: findSede._id,
      };
      await postNavesAlmacen(newForm);
    } catch (error) {
      sendMessage(error.message || "Error al registrar la nave", "Error");
    } finally {
      setDeshabilitar(false);
    }
  };
  const resetForm = () => {
    setForm({
      nombre: "",
      sede: "",
      descripcion: "",
    });
  };

  return (
    <div className="w-full h-full ">
      <DatosBasicos
        form={form}
        setForm={setForm}
        sedesName={sedesName}
        error={{
          nombre: false,
          sede: false,
          descripcion: false,
        }}
      />
      <div className="flex justify-center m-10 ">
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
export default RegisterNaves;
