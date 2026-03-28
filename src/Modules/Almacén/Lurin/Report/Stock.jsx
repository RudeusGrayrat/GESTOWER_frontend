import { useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import modificarPlantillaExcel from "../../../../utils/convertToExcel";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import Input from "../../../../recicle/Inputs/Inputs";

const Stock = ({ contratos, plantilla, contratosId }) => {
  const naves = [];
  const zonas = [];
  const [form, setForm] = useState({
    contrato: "",
    nave: "",
    Zona: "",
  });
  const sendMessage = useSendMessage();
  const findContrato = contratosId?.find(
    (contrato) => contrato.cliente === form.contrato
  );
  const enviar = async () => {
    sendMessage("Descargando archivo...", "Info");
    try {
      if (!findContrato) {
        sendMessage("Seleccione un contrato válido", "Error");
        return null;
      }
      const response = await axios.get("/getStockByParams", {
        params: {
          contratoId: findContrato._id,
          nave: form.nave,
          zona: form.Zona,
        },
      });
      const findStock = response.data;
      if (findStock.length === 0)
        return sendMessage("No hay datos para descargar", "Error");
      const archivo = plantilla;
      let PesoTotal = 0;
      const datos = findStock?.map((item) => {
        PesoTotal += item.productoId?.pesoNeto || 0;
        return {
          clase: item.clase || "",
          codigoInterno: item.movimientoId?.correlativa,
          numeroDeActa: item.movimientoId?.numeroDeActa,
          fechaRecepcion: item.movimientoId?.datosGenerales.fecha,
          peso: item.productoId?.pesoNeto,
          cantidad: item.productoId?.cantidad,
          unidadDeMedida: item.productoId?.unidadDeMedida,
          item: item.productoId?.item,
          descripcion: item.productoId?.descripcion,
          numeroDocumento: item.movimientoId?.numeroDocumento,
          contribuyente: item.movimientoId?.contribuyente,
          ubicacion:
            item.ubicacionId?.rack +
            " - " +
            "SECCION: " +
            item.ubicacionId?.nivel +
            "-" +
            item.ubicacionId?.seccion,
        };
      });
      const variablesIndividuales = {
        C2: `${PesoTotal} KG`,
      };
      const columnasMapeo = {
        1: "clase",
        2: "codigoInterno",
        3: "numeroDeActa",
        4: "fechaRecepcion",
        5: "peso",
        6: "cantidad",
        7: "unidadDeMedida",
        8: "item",
        9: "descripcion",
        10: "numeroDocumento",
        11: "contribuyente",
        12: "ubicacion",
      };
      const respose = await modificarPlantillaExcel(
        datos,
        columnasMapeo,
        archivo,
        "Reporte de Stock",
        variablesIndividuales,
        5
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
      title="Reporte de Stock (EXCEL)"
      options={contratos}
    >
      <Input
        label="Nave"
        name="nave"
        type="select"
        options={naves}
        value={form.nave}
        setForm={setForm}
      />
      <Input
        label="Zona"
        name="Zona"
        type="select"
        options={zonas}
        value={form.Zona}
        setForm={setForm}
      />
    </ReportAlmacen>
  );
};

export default Stock;
