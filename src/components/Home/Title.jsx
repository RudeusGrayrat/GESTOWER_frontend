import { useParams } from "react-router";
import ProtectedComponent from "./ProtectedComponent";
import Colaboradores from "../../Modules/RecursosHumanos/Colaboradores/Colaboradores";
import Clientes from "../../Modules/Comercial/Clientes/Clientes";
import Cotizacion from "../../Modules/Comercial/Cotización/Cotización";
import Empresas from "../../Modules/RecursosHumanos/Empresas/Empresas";
import Contratos from "../../Modules/RecursosHumanos/Contratos/Contratos";
import PlantillaContrato from "../../Modules/RecursosHumanos/PlantillaContrato/PlantillasContrato";
import AsistenciaColaborador from "../../Modules/RecursosHumanos/Asistencia/Colaborador/AsistenciaColaborador";
import BoletaDePagos from "../../Modules/RecursosHumanos/BoletaDePagos/BoletaDePagos";
import Certificados from "../../Modules/Certificación/Certificados/Certificados";
import Inventario from "../../Modules/Sistemas/Inventario/Inventario";
import Novedades from "../Widgets/Novedades/Novedades";
import WidgetsSistemas from "../../Modules/Sistemas/Widgets/Widgets";
import ModulosYSubmodulos from "../../Modules/Herramientas/Modulos Y Submodulos/ModulosYSubmodulos";
import ActivosDigitales from "../../Modules/Sistemas/Activos Digitales/ActivosDigitales";
import Backups from "../../Modules/Sistemas/Backups/Backups";
import Asignaciones from "../../Modules/Sistemas/Asignaciones/Asignaciones";
import Permissions from "../../Modules/Sistemas/Permisos/Permisos";
import Lurin from "../../Modules/Almacén/Lurin/Lurin";
import ContratoAlmacen from "../../Modules/Almacén/Contratos/ContratoAlmacen";
import SedesAlamcen from "../../Modules/Almacén/Sedes/Sede";
import Naves from "../../Modules/Almacén/Naves/Naves";
import ZonasAlmacen from "../../Modules/Almacén/Zonas/Zonas";
import Manifiestos from "../../Modules/Certificación/Manifiestos/Manifiestos";
import Generadores from "../../Modules/Certificación/Generadores/Generadores";
import Plantas from "../../Modules/Certificación/Plantas/Plantas";
import Ubigeo from "../../Modules/Certificación/Ubigeo/Ubigeo";

const componentMap = {
  "recursos humanos": {
    colaboradores: Colaboradores,
    empresas: Empresas,
    contratos: Contratos,
    "plantillas contrato": PlantillaContrato, //voy a volverlo solo plantillas y añadiré las plantillas de excel y word de asistencias boletas de pago y más
    asistencia: AsistenciaColaborador,
    "boleta de pagos": BoletaDePagos,
  },
  certificacion: {
    certificados: Certificados,
    manifiestos: Manifiestos,
    generadores: Generadores,
    plantas: Plantas,
    ubigeo: Ubigeo
  },
  comercial: {
    certificados: Certificados,
    clientes: Clientes,
    cotizacion: Cotizacion,
  },
  sistemas: {
    inventario: Inventario,
    asignaciones: Asignaciones,
    "activos digitales": ActivosDigitales,
    backups: Backups,
    permisos: Permissions,
  },
  herramientas: {
    novedades: Novedades,
    widgets: WidgetsSistemas,
    "modulos y submodulos": ModulosYSubmodulos,
  },
  almacen: {
    chincha: "Chincha",
    lurin: Lurin,
    moquegua: "Moquegua",
    contratos: ContratoAlmacen,
    sedes: SedesAlamcen,
    almacen: Naves,
    zonas: ZonasAlmacen,
  },
};

const Title = () => {
  const { module, submodule } = useParams();

  const moduleComponents = componentMap[module];
  const ComponentToRender = moduleComponents
    ? moduleComponents[submodule]
    : null;

  return (
    <div className="pl-20 overflow-auto w-full">
      <ProtectedComponent
        allowedSubmodules={[submodule]}
        allowedModules={[module]}
      >
        {ComponentToRender ? <ComponentToRender /> : "Submódulo no encontrado"}
      </ProtectedComponent>
    </div>
  );
};

export default Title;
