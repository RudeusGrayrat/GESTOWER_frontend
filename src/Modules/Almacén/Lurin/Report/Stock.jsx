import { useEffect, useState } from "react";
import ReportAlmacen from "../../Almacen/Report/Report";
import modificarPlantillaExcel from "../../../../utils/convertToExcel";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import Input from "../../../../recicle/Inputs/Inputs";
import { getNaveBySede, getZonasByParams } from "../../../../redux/modules/Almacen/actions";

const Stock = ({ contratos, plantilla, contratosId, sedeId }) => {
  const [naves, setNaves] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [form, setForm] = useState({
    contrato: "",
    nave: "",
    zona: "",
  });
  useEffect(() => {
    if (!form.contrato) {
      return
    } else {

      if (sedeId && !naves.length) {
        getNaveBySede(sedeId).then(setNaves);
      }
      if (form.nave) {
        getZonasByParams({ almacenId: form.nave?._id }).then(setZonas);
      }
    }
  }, [sedeId, form.nave, form.contrato]);

  const sendMessage = useSendMessage();
  const findContrato = contratosId?.find(
    (contrato) => contrato.cliente === form.contrato
  );

  const enviar = async () => {
    sendMessage("Descargando archivo...", "Info", true);
    try {
      if (!form.contrato) {
        sendMessage("Seleccione un contrato válido", "Error");
        return null;
      }
      const response = await axios.get("/getStockByParams", {
        params: {
          almacenId: form.nave?._id,
          zonaId: form.zona?._id,
          contratoId: form?.contrato?._id,
        },
      });
      const findStock = response.data;
      console.log("STOCK ENVIAR", findStock);
      if (findStock.length === 0)
        return sendMessage("No hay datos para descargar", "Error");
      const archivo = plantilla;
      let PesoTotal = 0;
      const datos = findStock?.data?.map((item) => {
        PesoTotal += Number(item.pesoNeto) || 0;
        console.log("Peso Neto actual:", item.pesoNeto, "Peso Total acumulado:", PesoTotal);
        return {
          clase: item.clase || "",
          codigoInterno: item.movimientoId?.correlativa,
          numeroDeActa: item.movimientoId?.numeroDeActa,
          fechaRecepcion: item.movimientoId?.datosGenerales.fecha,
          peso: Number(item.pesoNeto) || 0,
          cantidad: Number(item.cantidadTotal) || 0,
          unidadDeMedida: item.unidadDeMedida,
          item: item.item,
          descripcion: item.descripcion,
          numeroDocumento: item.movimientoId?.numeroDocumento,
          contribuyente: item.movimientoId?.contribuyente,
          ubicacion: item.ubicaciones?.map(
            (u) => `Rack: ${u.rack || ""} - Sección: ${u.seccion || ""} - Nivel: ${u.nivel || ""} `

          ),
        };
      });
      console.log("Datos para Excel", datos);
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
      if (respose) {
        sendMessage("Archivo descargado con éxito", "Bien");
        setForm({
          contrato: "",
          nave: "",
          zona: "",
        });
      }
      else sendMessage("Error al descargar el archivo", "Error");
    } catch (error) {
      sendMessage(error, "Error");
    }
  };
  return (
    <ReportAlmacen
      form={form}
      setForm={setForm}
      descargar={enviar}
      title="Reporte de Stock (EXCEL)"
      options={contratosId}
      optionLabel="cliente"
    >
      <Input
        label="Nave"
        name="nave"
        type="select"
        options={naves}
        optionLabel="nombre"
        value={form.nave}
        setForm={setForm}
      />
      <Input
        label="Zona"
        name="zona"
        type="select"
        options={zonas}
        optionLabel="nombre"
        value={form.zona}
        setForm={setForm}
        disabled={!form.nave}
      />
    </ReportAlmacen>
  );
};

export default Stock;
