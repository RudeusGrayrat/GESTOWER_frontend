import Input from "../../../../recicle/Inputs/Inputs";

const DatosBasicos = ({ form, setForm, error, colaboradores }) => {
  return (
    <div className="flex flex-wrap">
      <Input
        label="Colaborador"
        type="select"
        name="colaborador"
        options={colaboradores}
        value={form.colaborador}
        setForm={setForm}
        errorOnclick={error.colaborador}
      />
      <Input
        label="Fecha De Boleta"
        type="month"
        name="fechaBoletaDePago"
        value={form.fechaBoletaDePago}
        setForm={setForm}
        errorOnclick={error.fechaBoletaDePago}
      />
      <Input
        label="Días trabajados"
        inputMode="numeric"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        type="text"
        name="diasTrabajados"
        value={form.diasTrabajados}
        setForm={setForm}
        errorOnclick={error.diasTrabajados}
      />
      <Input
        label="Días subsidiados"
        inputMode="numeric"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        name="diasSubsidiados"
        value={form.diasSubsidiados}
        setForm={setForm}
        errorOnclick={error.diasSubsidiados}
      />
      <Input
        label="Horas trabajadas"
        inputMode="numeric"
        onKeyPress={(e) => {
          if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        type="text"
        name="horasTrabajadas"
        value={form.horasTrabajadas}
        setForm={setForm}
        errorOnclick={error.horasTrabajadas}
      />
      <Input
        label="Días no laborales"
        inputMode="numeric"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        name="diasNoLaborales"
        value={form.diasNoLaborales}
        setForm={setForm}
        errorOnclick={error.diasNoLaborales}
      />
    </div>
  );
};

export default DatosBasicos;
