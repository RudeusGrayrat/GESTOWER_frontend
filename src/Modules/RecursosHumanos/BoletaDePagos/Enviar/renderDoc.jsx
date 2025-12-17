import convertDocx from "../../../../utils/convertDocx";
const {
  VITE_PLANTILLA_INVERSIONES_LURIN,
  VITE_PLANTILLA_LADIAMB,
  VITE_PLANTILLA_TOWERANDTOWER,
  VITE_PLANTILLA_ECOLOGY,
  VITE_PLANTILLA_CORPEMSE,
} = import.meta.env;

const renderDoc = async (boleta, business, datosContables) => {
  let PLANTILLA_DOCUMENT;
  switch (business.razonSocial) {
    case "INVERSIONES LURIN S.A.C.":
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_INVERSIONES_LURIN;
      break;
    case "LABORATORIO DE INSTRUMENTOS AMBIENTALES S.A.C.":
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_LADIAMB;
      break;
    case "TOWER AND TOWER S.A.":
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_TOWERANDTOWER;
      break;
    case "ECOLOGY RESEARCH AND MENTORING S.C.R.L.":
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_ECOLOGY;
      break;
    case "CORPORACION DE EMPRESAS DE SERVICIOS SOCIEDAD ANONIMA CERRADA - CORPEMSE S.A.C":
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_CORPEMSE;
      break;
    default:
      PLANTILLA_DOCUMENT = VITE_PLANTILLA_TOWERANDTOWER;
      break;
  }
  try {
    const transformData = (data) => {
      const ingresos = data.remuneraciones.map((remuneracion, index) => {
        const conceptoObj = datosContables.find(
          (item) => item.codigoPlame === remuneracion.datosContables
        );
        return {
          isFirst: index === 0,
          codigo: remuneracion.datosContables,
          concepto: conceptoObj
            ? conceptoObj.concepto
            : "Concepto no encontrado",
          tipo: "INGRESOS",
          monto: parseFloat(remuneracion.monto),
        };
      });
      const descuentos = data.descuentosAlTrabajador.map((descuento, index) => {
        const conceptoObj = datosContables.find(
          (item) => item.codigoPlame === descuento.datosContables
        );
        return {
          isFirst: index === 0,
          codigo: descuento.datosContables,
          concepto: conceptoObj
            ? conceptoObj.concepto
            : "Concepto no encontrado",
          tipo: "APORTES DEL TRABAJADOR",
          monto: parseFloat(descuento.monto),
        };
      });
      const aportes = data.aportacionesDelEmpleador.map((aporte) => {
        const conceptoObj = datosContables.find(
          (item) => item.codigoPlame === aporte.datosContables
        );
        return {
          codigo: aporte.datosContables,
          concepto: conceptoObj
            ? conceptoObj.concepto
            : "Concepto no encontrado",
          monto: parseFloat(aporte.monto),
        };
      });
      const totalIngresos = ingresos.reduce(
        (sum, ingreso) => sum + ingreso.monto,
        0
      );
      const totalDescuentos = descuentos.reduce(
        (sum, descuento) => sum + descuento.monto,
        0
      );

      const total = parseFloat((totalIngresos - totalDescuentos).toFixed(2));
      const formattedData = {
        ruc_empresa: business.ruc,
        razonSocial_empresa: business.razonSocial,
        fechaBoletaDePago: data.fechaBoletaDePago,
        tipoD: data.colaborador.documentType,
        numeroD: data.colaborador.documentNumber,
        colaborador: data.colaborador.lastname + " " + data.colaborador.name,
        situacion: data.colaborador.state,
        codigoSpp: data.codigoSpp,
        ingreso: data.colaborador.dateStart,
        regimen: data.colaborador.regimenPension,
        días: parseInt(data.diasTrabajados) || 0,
        horas: parseInt(data.horasTrabajadas) || 0,
        tipoT: data.colaborador.type,
        noLaborados: parseInt(data.diasNoLaborales) || 0,
        diasSubsidiados: parseInt(data.diasSubsidiados) || 0,
        ingresos,
        descuentos,
        aportes,
        total: total,
      };

      return formattedData;
    };
    const formExcel = transformData(boleta);

    const archivo = PLANTILLA_DOCUMENT;
    if (!archivo) throw new Error("No se encontró la plantilla del documento");

    const convertir = await convertDocx(formExcel, archivo, "Boleta_de_Pago");
    if (!convertir)
      throw new Error(
        "No se pudo completar el proceso de renderizado de la boleta",
        "Error"
      );
    return convertir;
  } catch (error) {
    console.error("Error al renderizar la boleta:", error);
    throw new Error(error, "Error");
  }
};

export default renderDoc;
