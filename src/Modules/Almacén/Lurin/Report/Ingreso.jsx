import { useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import Input from "../../../../recicle/Inputs/Inputs";
import InputDate from "../../../../recicle/Inputs/tipos/InputDate";
import modificarPlantillaExcel from "../../../../utils/convertToExcel";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const Ingresos = ({ contratos, contratosId, plantilla }) => {
  const [form, setForm] = useState({
    contrato: "",
    codigoInterno: "",
    numeroDeActa: "",
    fechaIngreso: "",
  });
  const sendMessage = useSendMessage();
  const findContrato = contratosId?.find(
    (contrato) => contrato.cliente === form.contrato
  );
  const response = async () => {
    if (!findContrato) {
      sendMessage("Seleccione un contrato válido", "Error");
      return null;
    }
    await axios.get("/getStockByParams", {
      params: {
        contratoId: findContrato._id,
      },
    });
  };
  const findStock = response.data;
  const enviar = async () => {
    sendMessage("Descargando archivo...", "Info");
    try {
      if (findStock.length === 0)
        return sendMessage("No hay datos para descargar", "Error");
      const archivo = plantilla;
      const datos = findStock?.map((item) => {
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
      options={contratos}
    >
      <Input
        label="Código Interno"
        name="condigoInterno"
        type="select"
        value={form.codigoInterno}
        setError={setForm}
      />
      <Input
        label="Número de Acta"
        name="numeroDeActa"
        type="select"
        value={form.numeroDeActa}
        setError={setForm}
      />
      <InputDate
        label="Fecha de Ingreso"
        name="fechaIngreso"
        value={form.fechaIngreso}
        setForm={setForm}
      />
    </ReportAlmacen>
  );
};

export default Ingresos;
