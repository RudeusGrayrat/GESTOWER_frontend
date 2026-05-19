import { useEffect, useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import Input from "../../../../recicle/Inputs/Inputs";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";
import modificarPlantillaExcel from "../../../../utils/convertToExcel";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const { VITE_PLANTILLA_INGRESO_ALMACEN_LURIN: archivo } = import.meta.env;

const Ingresos = ({ contratos, contratosId, plantilla }) => {
  const [ingresoOptions, setIngresoOptions] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [form, setForm] = useState({
    contrato: "",
    codigoInterno: "",
    // fechaIngreso: "",
  });
  console.log("formulario de ingresos:", form);
  const sendMessage = useSendMessage();
  useEffect(() => {
    const isValid =
      form.contrato &&
      form.correlativa
    // form.fechaIngreso;
    setDisabled(!isValid);
  }, [form.contrato, form.correlativa,
    //  form.fechaIngreso
  ]);

  const enviar = async () => {
    sendMessage("Descargando archivo...", "Info");
    try {
      const response = await axios.get("/getAllMovimientosBySede", {
        params: {
          contratoId: form.contrato._id,
          correlativa: form.correlativa.correlativa,
          movimiento: "INGRESO",
        },
      });
      console.log("Respuesta de la API para el reporte de ingreso:", response);
      const data = response.data;
      console.log("Datos recibidos para el reporte de ingreso:", data);
      const datos = data?.data?.map((item) => {
        return {
          clase: item.clase,
          codigoInterno: item.codigoInterno,
          numeroDeActa: item.numeroDeActa,
          fechaRecepcion: item.fechaRecepcion,
          peso: item.peso,
          cantidad: item.cantidad,
          unidadDeMedida: item.unidadDeMedida,
          item: item.item,
          descripcion: item.descripcion,
          numeroDocumento: item.numeroDocumento,
          contribuyente: item.contribuyente,
        };
      });
      const columnasMapeo = {
        1: (dato, index) => index + 1, // Número correlativo (valor dinámico)
        2: "clase",
        3: "codigoInterno",
        4: "numeroDeActa",
        5: "fechaRecepcion",
        6: "peso",
        7: "cantidad",
        8: "unidadDeMedida",
        9: "item",
        10: "descripcion",
        11: "numeroDocumento",
        12: "contribuyente",
      };
      const respose = await modificarPlantillaExcel(
        datos,
        columnasMapeo,
        archivo,
        "Reporte de Boletas de Pago"
      );
      if (respose) sendMessage("Archivo descargado con éxito", "Bien");
      else sendMessage("Error al descargar el archivo", "Error");
    } catch (error) {
      sendMessage(error?.message || error, "Error");
    }
  };

  return (
    <ReportAlmacen
      form={form}
      setForm={setForm}
      descargar={enviar}
      title="Reporte de Ingreso (WORD)"
      options={contratosId}
      disable={disabled}
      optionLabel={"cliente"}
    >
      <Input
        label="Correlativa de Ingreso"
        name="correlativa"
        type="autocomplete"
        fetchData={"/getMovimientoByCodigo"}
        setOptions={setIngresoOptions}
        extraParams={{ movimiento: "INGRESO", contratoId: form.contrato?._id }}
        value={form.correlativa}
        setForm={setForm}
        placeholder="Escriba el código de ingreso para precargar datos"
        field="correlativa"
        disabled={!form.contrato}
        options={ingresoOptions}
      />
      <Input
        label="Número de Acta"
        name="numeroDeActa"
        value={form.correlativa?.numeroDeActa}
        disabled
      />
      {/* <InputDate
        label="Fecha de Ingreso"
        name="fechaIngreso"
        value={form.fechaIngreso}
        setForm={setForm}
      /> */}
    </ReportAlmacen>
  );
};

export default Ingresos;
