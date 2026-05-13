import { useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import AsyncSelectInput from "../../../../recicle/Inputs/tipos/InputSearch";

const DatosBasicos = ({ form, setForm, contratoOptions, error, salida }) => {
  const [ingresoOptions, setIngresoOptions] = useState([]);
  return (
    <div className="w-full flex flex-wrap">
      <Input
        label="Movimiento"
        name="movimiento"
        type="select"
        options={["INGRESO", "SALIDA"]}
        value={form.movimiento}
        setForm={setForm}
        errorOnclick={error.movimiento}
      />
      {form.movimiento === "SALIDA" && (
        <Input
          label="Código de Ingreso"
          name="codigoIngreso"
          type="autocomplete"
          fetchData={"/getMovimientoByCodigo"}
          setOptions={setIngresoOptions}
          value={form.codigoIngreso}
          setForm={setForm}
          placeholder="Escriba el código de ingreso para precargar datos"
          field="correlativa"
          options={ingresoOptions}
        />
      )}

      <Input
        label="Contrato"
        name="contrato"
        type="select"
        options={contratoOptions}
        value={form.contrato}
        setForm={setForm}
        errorOnclick={error.contrato}
        disabled={salida}
      />
      <Input
        label="Número de Acta"
        name="numeroDeActa"
        value={form.numeroDeActa}
        setForm={setForm}
        errorOnclick={error.numeroDeActa}
        disabled={salida}
      />
      <Input
        label="Contribuyente"
        name="contribuyente"
        value={form.contribuyente}
        setForm={setForm}
        errorOnclick={error.contribuyente}
        disabled={salida}
      />
      <Input
        label="Numero de Documento"
        name="numeroDocumento"
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        value={form.numeroDocumento}
        setForm={setForm}
        errorOnclick={error.numeroDocumento}
        disabled={salida}
      />
    </div>
  );
};

export default DatosBasicos;
