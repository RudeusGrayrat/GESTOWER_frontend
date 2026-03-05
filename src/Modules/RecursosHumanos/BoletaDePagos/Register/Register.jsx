import { useEffect, useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./Datosbasicos";
import useValidation from "./validateBoletas";
import PopUp from "../../../../recicle/popUps";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import dayjs from "dayjs";
import Remuneraciones from "./Remuneraciones";
import DescuentosAlTrabajador from "./DescuentosTrabajador";
import AportacionesDelEmpleador from "./AportacionsEmpleador";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import { useDispatch, useSelector } from "react-redux";

import { validateVacio } from "./validateComun";
import { useAuth } from "../../../../context/AuthContext";
import {
  getDatosContables,
  getEmployees,
} from "../../../../redux/modules/Recursos Humanos/actions";
import useSendMessage from "../../../../recicle/senMessage";

const RegisterBoletaDePagos = ({ formInitial, setFormEdit }) => {
  const { postBoletasDePago } = useAuth();
  const dispatch = useDispatch();
  const datosContables = useSelector(
    (state) => state.recursosHumanos.datosContables
  );
  const sendMessage = useSendMessage();
  useEffect(() => {
    if (datosContables.length === 0) dispatch(getDatosContables());
  }, [dispatch, datosContables]);

  const colaboradores = useSelector(
    (state) => state.recursosHumanos.allEmployees
  );

  useEffect(() => {
    if (colaboradores.length === 0) dispatch(getEmployees());
  }, [colaboradores]);

  const colaboradorName = colaboradores.map(
    (colaborador) => colaborador?.lastname + " " + colaborador?.name
  );

  const [form, setForm] = useState(
    formInitial
      ? formInitial
      : {
        colaborador: "",
        diasTrabajados: "",
        fechaBoletaDePago: "",
        diasSubsidiados: "0",
        horasTrabajadas: "192",
        diasNoLaborales: "0",
        remuneraciones: [
          { datosContables: "0121", monto: "0" },
          { datosContables: "0201", monto: "0" },
        ],
        descuentosAlTrabajador: [
          { datosContables: "0701", monto: "0" },
          { datosContables: "0705", monto: "0" },
          { datosContables: "0601", monto: "0" },
          { datosContables: "0605", monto: "0" },
          { datosContables: "0606", monto: "0" },
          { datosContables: "0608", monto: "0" },
        ],
        aportacionesDelEmpleador: [
          { datosContables: "0803", monto: "0" },
          { datosContables: "0804", monto: "0" },
          { datosContables: "0810", monto: "0" },
          { datosContables: "0814", monto: "0" },
        ],
      }
  );

  const validateDescuentos = validateVacio(form.descuentosAlTrabajador);
  const validateAportes = validateVacio(form.aportacionesDelEmpleador);
  useEffect(() => {
    if (formInitial) {
      setForm({ ...formInitial });
    }
  }, [dispatch, formInitial]);

  useEffect(() => {
    if (setFormEdit) setFormEdit({ ...form });
  }, [form, setFormEdit]);

  const { error, validateForm } = useValidation();

  const enviar = async () => {
    try {
      if (validateForm(form)) {
        if (
          Object.keys(validateDescuentos).length > 0 ||
          Object.keys(validateAportes).length > 0
        ) {
          sendMessage("Hay uno o mas campos vacios", "Alerta");
        } else {
          const colaboradorId = colaboradores?.find(
            (colaborador) =>
              colaborador?.lastname + " " + colaborador?.name ===
              form?.colaborador
          );
          if (parseInt(form.horasTrabajadas) > 192) {
            sendMessage(
              "Las horas trabajadas no pueden ser mayor a 192",
              "Alerta"
            );

            return;
          }
          const newForm = {
            ...form,
            colaborador: colaboradorId?._id,
            fechaBoletaDePago: dayjs(form.fechaBoletaDePago)?.format("MM/YYYY"),
          };
          await postBoletasDePago(newForm);
        }
      } else {
        sendMessage("Faltan Datos", "Alerta");
      }
    } catch (error) {
      sendMessage(error, "Error");
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      <PopUp />
      <CardPlegable title="Datos Generales">
        <DatosBasicos
          setForm={setForm}
          colaboradores={colaboradorName}
          error={error}
          form={form}
        />
      </CardPlegable>
      <CardPlegable title="Remuneraciones">
        <Directorio
          ItemComponent={Remuneraciones}
          directory={form.remuneraciones}
          form={form.remuneraciones}
          error={error}
          data="remuneraciones"
          estilos="flex  "
          setForm={setForm}
          datosContables={datosContables}
        />
      </CardPlegable>
      <CardPlegable title="Descuentos al Trabajador">
        <Directorio
          ItemComponent={DescuentosAlTrabajador}
          form={form.descuentosAlTrabajador}
          datosContables={datosContables}
          setForm={setForm}
          directory={form.descuentosAlTrabajador}
          error={error}
          data="descuentosAlTrabajador"
          estilos="flex "
        />
      </CardPlegable>
      <CardPlegable title="Aportaciones del Empleador">
        <Directorio
          ItemComponent={AportacionesDelEmpleador}
          form={form.aportacionesDelEmpleador}
          datosContables={datosContables}
          setForm={setForm}
          directory={form.aportacionesDelEmpleador}
          error={error}
          data="aportacionesDelEmpleador"
          estilos="flex  "
        />
      </CardPlegable>

      {!setFormEdit && (
        <div className="flex justify-center">
          <ButtonOk children="Enviar" onClick={enviar} classe={"w-60"} type="ok" />
        </div>
      )}
    </div>
  );
};

export default RegisterBoletaDePagos;
