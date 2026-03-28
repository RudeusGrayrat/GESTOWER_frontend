import dayjs from "dayjs";
import axios from "../../../../api/axios";
import Report from "../../../../components/Principal/Permissions/Report";
import useSendMessage from "../../../../recicle/senMessage";
import modificarPlantillaExcel from "../../../../utils/convertToExcel";
const plantilla = import.meta.env.VITE_REPORTE_BOLETA_EXCEL;

const BoletaExcel = ({ form, setForm, options }) => {
  const sendMessage = useSendMessage();

  const findBoletas = async () => {
    try {
      const params = {
        empresa: form.empresa !== "TODOS" ? form.empresa : undefined,
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

  const descargar = async () => {
    sendMessage("Descargando archivo...", "Info");
    try {
      const boletas = await findBoletas();
      if (boletas.length === 0)
        return sendMessage("No hay datos para descargar", "Error");
      const archivo = plantilla;
      const datos = boletas?.map((item) => {
        return {
          colaborador:
            item.colaborador?.lastname + " " + item.colaborador?.name,
          ndoc: item.colaborador?.documentNumber,
          empresa: item.colaborador?.business,
          estado: item.state,
          fechaBoletaDePago: item.fechaBoletaDePago,
          envio: item.envio,
          recepcion: item.recepcion,
        };
      });
      const columnasMapeo = {
        1: (dato, index) => index + 1, // Número correlativo (valor dinámico)
        2: "colaborador",
        3: "ndoc",
        4: "empresa",
        5: "estado",
        6: "fechaBoletaDePago",
        7: "envio",
        8: "recepcion",
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
    <Report
      descargar={descargar}
      setForm={setForm}
      form={form}
      options={options}
      title="Reporte de Boletas de Pago (Excel)"
    />
  );
};

export default BoletaExcel;
