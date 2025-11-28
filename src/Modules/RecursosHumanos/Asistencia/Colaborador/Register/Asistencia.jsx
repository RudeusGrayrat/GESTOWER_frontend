import Input from "../../../../../recicle/Inputs/Inputs";
import InputDate from "../../../../../recicle/Inputs/tipos/InputDate";
import InputTime from "../../../../../recicle/Inputs/tipos/InputTime";

const DatosDeAsistencia = ({ setForm, error, form }) => {
  return (
    <div className="flex flex-wrap">
      <InputDate
        label="Fecha De Asistencia"
        name="fecha"
        value={form.fecha}
        setForm={setForm}
        errorOnclick={error.fecha}
      />
      <InputTime
        label="Hora de Ingreso"
        name="ingreso"
        value={form.ingreso}
        setForm={setForm}
        errorOnclick={error.ingreso}
      />
      <Input
        name="ingresoSede"
        label="Sede de Ingreso"
        type="select"
        editable={false}
        ancho={"!w-60 !px-2 !p-0"}
        options={["SAN ISIDRO", "CHINCHA", "LURIN", "LA VICTORIA", "MOQUEGUA"]}
        value={form.ingresoSede}
        setForm={setForm}
        errorOnclick={error.ingresoSede}
      />
      <InputTime
        label="Inicio de Almuerzo"
        name="inicioAlmuerzo"
        value={form.inicioAlmuerzo}
        setForm={setForm}
        errorOnclick={error.inicioAlmuerzo}
      />
      <InputTime
        label="Fin de Almuerzo"
        name="finAlmuerzo"
        value={form.finAlmuerzo}
        setForm={setForm}
        errorOnclick={error.finAlmuerzo}
      />
      <Input
        name="almuerzoSede"
        label="Sede de Almuerzo"
        type="select"
        editable={false}
        ancho={"!w-60 !px-2 !p-0"}
        options={["SAN ISIDRO", "CHINCHA", "LURIN", "LA VICTORIA", "MOQUEGUA"]}
        value={form.almuerzoSede}
        setForm={setForm}
        errorOnclick={error.almuerzoSede}
      />
      <InputTime
        label="Hora de Salida"
        name="salida"
        value={form.salida}
        setForm={setForm}
        errorOnclick={error.salida}
      />
      <Input
        name="salidaSede"
        label="Sede de Salida"
        type="select"
        editable={false}
        ancho={"!w-60 !px-2 !p-0"}
        options={["SAN ISIDRO","CHINCHA", "LURIN", "LA VICTORIA", "MOQUEGUA"]}
        value={form.salidaSede}
        setForm={setForm}
        errorOnclick={error.salidaSede}
      />
      <Input
        name="estado"
        label="Estado"
        type="select"
        editable={false}
        ancho={"!w-60 !px-2 !p-0"}
        options={["PRESENTE", "FALTA", "TARDANZA", "PERMISO", "VACACIONES"]}
        value={form.estado}
        setForm={setForm}
        errorOnclick={error.estado}
      />
      <Input
        label="Observaciones"
        name="observaciones"
        value={form.observaciones}
        setForm={setForm}
        errorOnclick={error.observaciones}
        ancho="!w-96"
      />
    </div>
  );
};

export default DatosDeAsistencia;
