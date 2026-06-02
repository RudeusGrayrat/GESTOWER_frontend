import Report from "../../../../components/Principal/Permissions/Report";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import convertDocx from "../../../../utils/convertDocx";
import dayjs from "dayjs";

const {
  VITE_REPORTE_ENVIO_BOLETA_WORD_TOWER,
  VITE_REPORTE_ENVIO_BOLETA_WORD_ECOLOGY,
  VITE_REPORTE_ENVIO_BOLETA_WORD_LADIAMB,
  VITE_REPORTE_ENVIO_BOLETA_WORD_INVERSIONES_LURIN,
  VITE_REPORTE_ENVIO_BOLETA_WORD_CORPEMSE,
} = import.meta.env;
const EnvioWord = ({ form, setForm, options }) => {
  const sendMessage = useSendMessage();
  const findBoletas = async () => {
    try {
      const params = {
        empresa: form.empresa?._id !== "" ? form.empresa._id : undefined,
        desde: dayjs(form.desde, "YYYY-MM").format("MM/YYYY"),
        hasta: dayjs(form.hasta, "YYYY-MM").format("MM/YYYY"),
      };

      const { data } = await axios.get("/getBoletaDePagos", { params });
      return data;
    } catch (error) {
      console.error("Error obteniendo boletas", error);
      return [];
    }
  };
  let año;
  if (form.desde.split("-")[0] === form.hasta.split("-")[0]) {
    año = form.hasta.split("-")[0];
  } else {
    año = `${form.desde.split("-")[0]} - ${form.hasta.split("-")[0]}`;
  }
  const descargar = async () => {
    sendMessage("Descargando archivo...", "Info", true);
    const boletas = await findBoletas();
    console.log("boletas", boletas);

    if (boletas.length === 0)
      return sendMessage(
        "No hay boletas de pago para el periodo seleccionado",
        "Error"
      );

    try {
      const fullBoletasEnvios = boletas.map((item) => {
        return {
          colaborador:
            item.colaborador?.lastname + " " + item.colaborador?.name,
          documentNumber: item.colaborador?.documentNumber,
          fechaboletadepago: item.fechaBoletaDePago,
          envio: item.envio || "---",
          recepcion: item.recepcion || "---",
          state: item.state,
        };
      });

      const predata = {
        año: año,
        boleta: fullBoletasEnvios,
      };
      let PLANTILLA_DOCUMENT;
      switch (form.empresa?.razonSocial) {
        case "INVERSIONES LURIN S.A.C.":
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_INVERSIONES_LURIN;
          break;
        case "LABORATORIO DE INSTRUMENTOS AMBIENTALES S.A.C.":
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_LADIAMB;
          break;
        case "TOWER AND TOWER S.A.":
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_TOWER;
          break;
        case "ECOLOGY RESEARCH AND MENTORING S.C.R.L.":
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_ECOLOGY;
          break;
        case "CORPORACION DE EMPRESAS DE SERVICIOS SOCIEDAD ANONIMA CERRADA - CORPEMSE S.A.C":
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_CORPEMSE;
          break;
        default:
          PLANTILLA_DOCUMENT = VITE_REPORTE_ENVIO_BOLETA_WORD_TOWER;
          break;
      }
      const archivo = PLANTILLA_DOCUMENT;
      if (!archivo)
        return sendMessage(
          "Error al generar el documento: plantilla no encontrada",
          "Error"
        );
      const response = await convertDocx(
        predata,
        archivo,
        `${form.empresa?.razonSocial} - ${form.desde} - ${form.hasta}`
      );

      if (!response || !(response instanceof File))
        return sendMessage(
          "Error al generar el documento: el resultado no es un archivo válido",
          "Error"
        );

      const url = URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${form.empresa?.razonSocial} - ${form.desde} - ${form.hasta}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      sendMessage(error.message, "Error");
    } finally {
      sendMessage("Archivo descargado con éxito", "Bien");
    }
  };
  return (
    <Report
      descargar={descargar}
      setForm={setForm}
      form={form}
      options={options}
      title={"Reporte de Envio (Word)"}
    />
  );
};

export default EnvioWord;
