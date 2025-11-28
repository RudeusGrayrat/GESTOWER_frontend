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

  return (
    <form className="w-full flex flex-wrap" autoComplete="off">
      <InputDate
        label="Fecha De Ingreso"
        name="fecha"
        value={form.datosGenerales.fecha}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.fecha}
      />
      <InputTime
        label="Hora de Ingreso"
        name="horaIngreso"
        value={form.datosGenerales.horaIngreso}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.horaIngreso}
      />
      <Input
        label="Recepcionado Por"
        name="recepcionadoPor"
        value={form.datosGenerales.recepcionadoPor}
        setForm={setForm}
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
        value={form.datosGenerales.dniRecepcionadoPor}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.dniRecepcionadoPor}
      />
      <Input
        label="Responsable Entrega"
        name="responsableEntrega"
        value={form.datosGenerales.responsableEntrega}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.responsableEntrega}
      />

      <Input
        label="Registro o CIP"
        name="registroOCIP"
        value={form.datosGenerales.registroOCIP}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.registroOCIP}
      />
      <Input
        label="Estado de Acta"
        name="estadoActa"
        type="select"
        options={options || []}
        value={form.datosGenerales.estadoActa}
        setForm={setForm}
        errorOnclick={error.datosGenerales?.estadoActa}
      />
    </form>
  );
};

export default DatosGenerales;
