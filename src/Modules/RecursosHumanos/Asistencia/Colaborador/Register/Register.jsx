import { useEffect, useState } from "react";
import Register from "../../../../../components/Principal/Register/Register";
import CardPlegable from "../../../../../recicle/Divs/CardPlegable";
import DatosDeAsistencia from "./Asistencia";
import DatoDeColaborador from "./Colaborador";
import useValidation from "../validateAsistenciaColaborador";
import { useAuth } from "../../../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import useSendMessage from "../../../../../recicle/senMessage";
import { getEmployees } from "../../../../../redux/modules/Recursos Humanos/actions";
import dayjs from "dayjs";

const RegisterAsistenciaColaborador = () => {
  const { createAsistenciaColaborador } = useAuth();
  const [form, setForm] = useState({
    colaborador: "",
    fecha: dayjs().format("DD/MM/YYYY"),
    ingreso: "",
    ingresoSede: "",
    salida: "",
    salidaSede: "",
    inicioAlmuerzo: "",
    finAlmuerzo: "",
    almuerzoSede: "",
    observaciones: "",
    estado: "PRESENTE",
  });
  console.log("🚀 ~ file: Register.jsx:17 ~ RegisterAsistenciaColaborador ~ form:", form);
  const sendMessage = useSendMessage();
  const colaboradores = useSelector(
    (state) => state.recursosHumanos.allEmployees
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (colaboradores.length === 0) dispatch(getEmployees());
  }, [colaboradores]);
  const { error, validateForm } = useValidation();

  const register = async () => {
    sendMessage("Registrando Asistencia", "Espere");
    if (!validateForm(form) && form.estado !== "PERMISO") return sendMessage("Formulario Incompleto", "error");
    try {
      const colaboradorId = await colaboradores.find(
        (colaborador) =>
          colaborador.lastname + " " + colaborador.name === form.colaborador
      );
      if (!colaboradorId)
        return sendMessage("Colaborador no encontrado", "error");
      const newForm = {
        ...form,
        colaborador: colaboradorId._id,
      };
      delete newForm.tipoDeColaborador;
      await createAsistenciaColaborador(newForm);
    } catch (error) {
      sendMessage(error.message, "Error");
    }
  };
  const resetForm = () => {
    setForm({
      colaborador: "",
      fecha: dayjs().format("DD/MM/YYYY"),
      ingreso: "",
      ingresoSede: "",
      salida: "",
      salidaSede: "",
      inicioAlmuerzo: "",
      finAlmuerzo: "",
      almuerzoSede: "",
      observaciones: "",
      estado: "PRESENTE",
    });
  };
  return (
    <Register registrar={register} resetForm={() => resetForm()} validate={() => validateForm(form.estado === "PERMISO" ? { colaborador: form.colaborador, fecha: form.fecha } : form)}>
      <CardPlegable title="Datos de Asistencia">
        <DatosDeAsistencia setForm={setForm} error={error} form={form} />
      </CardPlegable>
      <CardPlegable title="Datos del Colaborador">
        <DatoDeColaborador setForm={setForm} error={error} form={form} />
      </CardPlegable>
    </Register>
  );
};

export default RegisterAsistenciaColaborador;
