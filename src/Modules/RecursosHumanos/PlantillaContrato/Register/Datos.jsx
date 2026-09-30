import Input from "../../../../recicle/Inputs/Inputs";
import InpuFiles from "../../../../recicle/Inputs/tipos/InputFile";

const  Datos = ({ formData, setFormData, error }) => {
  return (
    <div className="flex flex-wrap">
      <Input
        name="nombre"
        ancho="w-96"
        label="Nombre de la Plantilla"
        value={formData.nombre}
        setForm={setFormData}
        errorOnclick={error.nombre}
      />
      <Input
        name="tipo"
        label="Tipo de Plantilla"
        type="select"
        options={["CONTRATO", "BOLETA"]}
        value={formData.tipo}
        setForm={setFormData}
        errorOnclick={error.tipo}
      />
      {formData.tipo === "CONTRATO" && (
        <Input
          name="tipoContrato"
          ancho="w-96"
          label="Tipo de Contrato"
          value={formData.tipoContrato}
          setForm={setFormData}
          errorOnclick={error.tipoContrato}
        />
      )}
      <InpuFiles
        name="archivo"
        label="Plantilla Docx"
        type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        setForm={setFormData}
        errorOnclick={error.archivo}
        toBase64={false}
        value={formData.archivo}
      />
      <Input
        name="state"
        label="Estado"
        type="select"
        options={["ACTIVO", "INACTIVO"]}
        value={formData.state}
        setForm={setFormData}
        errorOnclick={error.state}
      />
    </div>
  );
};
export default Datos;
