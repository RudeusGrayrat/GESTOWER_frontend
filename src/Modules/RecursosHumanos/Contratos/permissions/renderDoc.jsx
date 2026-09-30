import dayjs from "dayjs";
import convertDocx from "../../../../utils/convertDocx";
import numbers from "numeros_to_words";

const renderDoc = async (selected, empresa, archivo) => {
  const { typeContract, dateStart, dateEnd, colaborador } = selected;
  const fechaData = (data) => {
    const fechaFormateada = data?.split("/").reverse().join("-");
    const date = dayjs(fechaFormateada);
    return date;
  };
  const mesesContrato = fechaData(dateEnd).diff(fechaData(dateStart), "month");
  try {
    const predata = {
      empresa_razon_social: empresa.razonSocial || "No disponible",
      empresa_ruc: empresa.ruc || "No disponible",
      empresa_domicilio_fiscal: empresa.domicilioFiscal || "No disponible",
      representante_nombres: empresa.representative.name || "No disponible",
      representante_tipo_documento:
        empresa.representative.documentType || "No disponible",
      representante_numero_documento:
        empresa.representative.documentNumber || "No disponible",
      logo_empresa: empresa.logo || "",
      firma: empresa.representative?.signature || "",
      colaborador_nombres:
        colaborador.lastname + " " + colaborador.name || "No disponible",
      colaborador_tipo_documento: colaborador.documentType || "No disponible",
      colaborador_numero_documento:
        colaborador.documentNumber || "No disponible",
      colaboador_distrito: colaborador.location?.distrito || "No disponible",
      colaborador_provincia: colaborador.location?.provincia || "No disponible",
      colaborador_domicilio: colaborador.location?.direccion || "No disponible",
      colaborador_correo: colaborador.email || "No disponible",
      colaborador_ocupacion: colaborador.charge || "No disponible",
      colaborador_funcion: colaborador.funcion || "No disponible",
      colaborador_sede: colaborador.sede || "No disponible",
      dateStart: dateStart || "No disponible",
      dateEnd: dateEnd || "No disponible",
      sueldo: colaborador.sueldo || "No disponible",
      pago_texto: numbers(colaborador.sueldo).toString() || "No disponible",
      fecha_texto: dateStart || "No disponible",
      meses: `${mesesContrato} meses` || "No disponible",
    };

    const convertir = await convertDocx(
      predata,
      archivo,
      `${dateStart}-${colaborador.documentNumber}-${typeContract}`
    );
    if (!convertir)
      throw new Error(
        "No se pudo completar el proceso de renderizado de la boleta",
        "Error"
      );
    return convertir;
  } catch (error) {
    throw new Error(error, "Error");
  }
};

export default renderDoc;
