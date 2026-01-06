import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import InputTime from "../../../../recicle/Inputs/tipos/InputTime";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";

const DatosGenerales = ({ form, setForm, error }) => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (form.movimiento === "SALIDA") {
      setOptions([
        "DEVOLUCIÓN",
        "DISPOSICIÓN FINAL",
        "DESTRUCCIÓN",
        "EXTRACCIÓN DE MUESTRAS",
      ]);
      // //esto provoca el cambio del estado del acta a vacio cuando se cambia el tipo de movimiento
      // setForm((prev) => ({
      //   ...prev,
      //   datosGenerales: {
      //     ...prev.datosGenerales,
      //     estadoActa: "",
      //   },
      // }));
    } else {
      setOptions([
        "INCAUTACIÓN",
        "TRASLADO INTERNO",
        "INMOVILIZACION",
        "DETECCIÓN DE INFRACCIONES",
        "ACTA DE PROVATORIA",
      ]);
      //esto provoca el cambio del estado del acta a vacio cuando se cambia el tipo de movimiento
      // setForm((prev) => ({
      //   ...prev,
      //   datosGenerales: {
      //     ...prev.datosGenerales,
      //     estadoActa: "",
      //   },
      // }));
    }
  }, [form.movimiento]);
  const [localform, setLocalForm] = useState(form.datosGenerales);
  useEffect(() => {
    setForm((prev) => ({ ...prev, datosGenerales: localform }));
  }, [localform]);

  return (
    <form className="w-full flex flex-wrap" autoComplete="off">
      <InputDate
        label="Fecha De Ingreso"
        name="fecha"
        value={localform.fecha}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.fecha}
      />
      <InputTime
        label="Hora de Ingreso"
        name="horaIngreso"
        value={localform.horaIngreso}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.horaIngreso}
      />
      <Input
        label="Recepcionado Por"
        name="recepcionadoPor"
        value={localform.recepcionadoPor}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.recepcionadoPor}
      />
      <Input
        label="DNI Recepcionado Por"
        name="dniRecepcionadoPor"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        value={localform.dniRecepcionadoPor}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.dniRecepcionadoPor}
      />
      <Input
        label="Responsable Entrega"
        name="responsableEntrega"
        value={localform.responsableEntrega}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.responsableEntrega}
      />

      <Input
        label="Registro o CIP"
        name="registroOCIP"
        value={localform.registroOCIP}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.registroOCIP}
      />
      <Input
        label="Estado de Acta"
        name="estadoActa"
        type="select"
        options={options || []}
        value={localform.estadoActa}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.estadoActa}
      />
    </form>
  );
};

export default DatosGenerales;
