import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import InpuFiles from "../../../../recicle/Inputs/tipos/InputFile";

const Representante = ({ setForm, error, form }) => {
  const { name, documentType, documentNumber } = form.representative;
  const [actualForm, setActualForm] = useState({
    ...form.representative,
  });
  useEffect(() => {
    setForm({ ...form, representative: actualForm });
  }, [actualForm]);
  return (
    <div className="flex flex-wrap space py-8 p-12 items-center w-full">
      <Input
        label="Apellidos y Nombres"
        name="name"
        setForm={setActualForm}
        value={name}
        errorOnclick={error.representative.name}
      />
      <Input
        label="Tipo de Documento"
        name="documentType"
        setForm={setActualForm}
        value={documentType}
        errorOnclick={error.representative.documentType}
      />
      <Input
        label="Número de Documento"
        name="documentNumber"
        type="string"
        setForm={setActualForm}
        value={documentNumber}
        errorOnclick={error.representative.documentNumber}
      />
      <InpuFiles
        label="Firma Digital"
        name="signature"
        value={form.representative?.signature}
        setForm={setActualForm}
        errorOnclick={error.representative.signature}
      />
    </div>
  );
};

export default Representante;
