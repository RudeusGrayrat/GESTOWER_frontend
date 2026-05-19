import { useEffect, useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import Input from "../../../../recicle/Inputs/Inputs";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";

const Salidas = ({ contratos, contratosId }) => {
  const [ingresoOptions, setIngresoOptions] = useState([]);
  console.log("Contratos recibidos en Salidas:", contratos);
  console.log("ContratosId recibidos en Salidas:", contratosId);
  const [form, setForm] = useState({
    contrato: "",
    codigoInterno: "",
    numeroDeActa: "",
    fechaSalida: "",
  });
  //necesito hacer un validate para que no se pueda enviar el form si no está todo
  const [disable, setDisable] = useState(true);
  // validar que todos los campos requeridos estén completos
  useEffect(() => {
    const isValid =
      form.contrato &&
      form.codigoIngreso &&
      form.numeroDeActa &&
      form.fechaSalida;
    setDisable(!isValid);
  }, [form.contrato, form.codigoIngreso, form.numeroDeActa, form.fechaSalida]);

  console.log("Estado del formulario en Salidas:", form);
  const enviar = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (disable) return;
    console.log("Formulario enviado:", form);
  };
  return (
    <ReportAlmacen
      form={form}
      setForm={setForm}
      descargar={enviar}
      title="Reporte de Salida (WORD)"
      options={contratosId}
      optionLabel="cliente"
      disable={disable}
    >
      <Input
        label="Código de Ingreso"
        name="codigoIngreso"
        type="autocomplete"
        fetchData={"/getMovimientoByCodigo"}
        setOptions={setIngresoOptions}
        extraParams={{ contratoId: form.contrato }}
        value={form.codigoIngreso}
        setForm={setForm}
        placeholder="Escriba el código de ingreso para precargar datos"
        field="correlativa"
        options={ingresoOptions}
        disabled={!form.contrato}
      />
      <Input
        label="Número de Acta"
        name="numeroDeActa"
        type="select"
        value={form.numeroDeActa}
        setError={setForm}
      />
      <InputDate
        label="Fecha de Salida"
        name="fechaSalida"
        value={form.fechaSalida}
        setForm={setForm}
      />
    </ReportAlmacen>
  );
};

export default Salidas;
