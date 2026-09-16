import convertDocx from "../../../../utils/convertDocx";
import { obtenerConceptoBoleta } from "../utils/conceptoBoleta";
import { obtenerSituacionTrabajador } from "../utils/situacionTrabajador";
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
  console.log("Plantilla seleccionada:", PLANTILLA_DOCUMENT);
  try {
    const transformData = (data) => {
      const ingresos = data.remuneraciones.map((remuneracion, index) => {
        return {
          isFirst: index === 0,
          codigo: remuneracion.datosContables,
          concepto: obtenerConceptoBoleta(remuneracion, datosContables),
          tipo: "INGRESOS",
          monto: parseFloat(remuneracion.monto),
        };
      });
      const descuentos = data.descuentosAlTrabajador.map((descuento, index) => {
        return {
          isFirst: index === 0,
          codigo: descuento.datosContables,
          concepto: obtenerConceptoBoleta(descuento, datosContables),
          tipo: "APORTES DEL TRABAJADOR",
          monto: parseFloat(descuento.monto),
        };
      });
      const aportes = data.aportacionesDelEmpleador.map((aporte) => {
        return {
          codigo: aporte.datosContables,
          concepto: obtenerConceptoBoleta(aporte, datosContables),
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
      const suspensiones = (data.suspensionesLaborales || []).map((suspension) => ({
        tipoSuspension: suspension.tipoSuspension || "NINGUNA",
        motivoSuspension: suspension.motivoSuspension || "NINGUNA",
        diasSuspension: parseInt(suspension.diasSuspension) || 0,
      }));
      const formattedData = {
        ruc_empresa: business.ruc,
        razonSocial_empresa: business.razonSocial,
        fechaBoletaDePago: data.fechaBoletaDePago,
        tipoD: data.colaborador.documentType,
        numeroD: data.colaborador.documentNumber,
        colaborador: data.colaborador.lastname + " " + data.colaborador.name,
        situacionEspecial: data.situacionEspecial || "NINGUNA",
        situacion: obtenerSituacionTrabajador(
          data.situacionTrabajador || data.colaborador?.state
        ),
        codigoSpp: data.codigoSpp || data.colaborador?.codigoSpp || "",
        ingreso: data.colaborador.dateStart,
        regimen: data.colaborador.regimenPension,
        días: parseInt(data.diasTrabajados) || 0,
        horas: parseInt(data.horasTrabajadas) || 0,
        tipoT: data.tipoTrabajador || data.colaborador?.tipoTrabajador || "Empleado",
        noLaborados: parseInt(data.diasNoLaborales) || 0,
        diasSubsidiados: parseInt(data.diasSubsidiados) || 0,
        suspensiones,
        tipoSuspension: suspensiones.map((item) => item.tipoSuspension).join("\n"),
        motivoSuspension: suspensiones.map((item) => item.motivoSuspension).join("\n"),
        diasSuspension: suspensiones.map((item) => item.diasSuspension).join("\n"),
        ingresos,
        descuentos,
        aportes,
        total: total,
      };

      return formattedData;
    };
    const formExcel = transformData(boleta);
    console.log("Datos formateados:", formExcel);

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
