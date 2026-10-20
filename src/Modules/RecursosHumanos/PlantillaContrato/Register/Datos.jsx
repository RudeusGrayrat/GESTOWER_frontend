import Input from "../../../../recicle/Inputs/Inputs";
import InpuFiles from "../../../../recicle/Inputs/tipos/InputFile";

const  Datos = ({ formData, setFormData, error, editando = false }) => {
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
      {!editando ? <Input
        name="tipo"
        label="Tipo de Plantilla"
        type="select"
        options={["CONTRATO", "BOLETA", "MANIFIESTO"]}
        value={formData.tipo}
        setForm={setFormData}
        errorOnclick={error.tipo}
      /> : <div className="mx-3 min-h-24"><span className="text-base font-medium text-gray-700">Tipo de Plantilla</span><p className="mt-2">{formData.tipo}</p></div>}
      {formData.tipo === "MANIFIESTO" && <p className="w-full mx-3 mb-3 text-sm text-gray-600">La plantilla activa se utiliza para generar manifiestos de GESTOWER y ManifesTower en todas sus etapas.</p>}
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
