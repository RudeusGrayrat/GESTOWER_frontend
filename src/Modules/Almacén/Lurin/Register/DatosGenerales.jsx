import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import InputTime from "../../../../recicle/Inputs/tipos/InputTime";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";

const DatosGenerales = ({ form, setForm, error, salida }) => {
  const [options, setOptions] = useState([]);
  console.log("DatosGenerales ~ salida:", salida)
  useEffect(() => {
    if (form.movimiento === "SALIDA") {
      setOptions(["DEVOLUCIÓN", "DISPOSICIÓN FINAL", "DESTRUCCIÓN", "EXTRACCIÓN DE MUESTRAS"]);
    } else {
      setOptions(["INCAUTACIÓN", "TRASLADO INTERNO", "INMOVILIZACION", "DETECCIÓN DE INFRACCIONES", "ACTA DE PROVATORIA"]);
    }
  }, [form.movimiento]);

  const [localform, setLocalForm] = useState(form.datosGenerales);

  // ✅ Propaga cambios locales hacia el padre
  useEffect(() => {
    if (!salida) {
      setForm((prev) => ({ ...prev, datosGenerales: localform }));
    }
  }, [localform]);

  // ✅ Solo para cuando llega data de salida (precarga)
  useEffect(() => {
    if (salida) {
      setLocalForm({ ...form.datosGenerales });
    }
  }, [salida, form.datosGenerales]);

  return (
    <form className="w-full flex flex-wrap" autoComplete="off">
      <Input
        label="Recepcionado Por"
        name="recepcionadoPor"
        value={localform.recepcionadoPor}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.recepcionadoPor}
        disabled={salida}
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
        disabled={salida}
      />
      <Input
        label="Responsable Entrega"
        name="responsableEntrega"
        value={localform.responsableEntrega}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.responsableEntrega}
        disabled={salida}
      />

      <Input
        label="Registro o CIP"
        name="registroOCIP"
        value={localform.registroOCIP}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.registroOCIP}
        disabled={salida}
      />
      <Input
        label="Estado de Acta"
        name="estadoActa"
        type="select"
        options={options || []}
        value={localform.estadoActa}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.estadoActa}
        disabled={salida}
      />
      <Input
        label="Fecha De Ingreso"
        name="fecha"
        type="date"
        value={localform.fecha}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.fecha}
        disabled={salida}
      />
      <Input
        label="Hora de Ingreso"
        name="horaIngreso"
        type="time"
        value={localform.horaIngreso}
        setForm={setLocalForm}
        errorOnclick={error.datosGenerales?.horaIngreso}
        disabled={salida}
      />
    </form>
  );
};

export default DatosGenerales;
