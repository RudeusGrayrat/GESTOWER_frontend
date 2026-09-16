import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import {
  motivoSuspensionLaboralOptions,
  tipoSuspensionLaboralOptions,
} from "../../utils/suspensionLaboralOptions";

const SuspensionesLaborales = ({ set, initialData }) => {
  const [formSuspension, setFormSuspension] = useState({
    tipoSuspension: initialData.tipoSuspension || "NINGUNA",
    motivoSuspension: initialData.motivoSuspension || "NINGUNA",
    diasSuspension: initialData.diasSuspension || "0",
  });

  useEffect(() => {
    set(formSuspension);
  }, [formSuspension]);

  return (
    <div className="flex flex-wrap">
      <Input
        label="Tipo de Suspensión"
        name="tipoSuspension"
        type="select"
        options={tipoSuspensionLaboralOptions}
        value={formSuspension.tipoSuspension}
        setForm={setFormSuspension}
      />
      <Input
        label="Concepto de Suspensión"
        name="motivoSuspension"
        type="select"
        options={motivoSuspensionLaboralOptions}
        value={formSuspension.motivoSuspension}
        setForm={setFormSuspension}
      />
      <Input
        label="Días de Suspensión"
        name="diasSuspension"
        inputMode="numeric"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        value={formSuspension.diasSuspension}
        setForm={setFormSuspension}
      />
    </div>
  );
};

export default SuspensionesLaborales;
