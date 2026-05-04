import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllContratosAlmacen } from "../../../redux/modules/Almacen/actions";

// Componentes
import RadioOption from "../../../recicle/Otros/Radio";
import PopUp from "../../../recicle/popUps";
import ListLurin from "./List/List";
import RegisterLurin from "./Register/Register";
import VistaGeneral from "./Ubicar/Vista";
import ReporteMovimientos from "./Report/Reporte";
import StockAlmacenLurin from "./Stock/Stock";

const Lurin = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const submodule = "LURIN";
  const [searchParams, setSearchParams] = useSearchParams();

  // --- LÓGICA DE PERMISOS IDÉNTICA A READORCREATE ---
  const hasPermission = () => {
    if (user) {
      const { modules } = user;
      const filtered = modules?.filter((mod) => mod.submodule?.name === submodule);
      return filtered[0]?.submodule?.permissions || [];
    }
    return [];
  };

  const permissions = hasPermission();
  const permissionRead = permissions.some((p) => p === "VER");
  const permissionCreate = permissions.some((p) => p === "CREAR");
  const permissionEdit = permissions.some((p) => p === "EDITAR");
  const permissionDelete = permissions.some((p) => p === "ELIMINAR");
  const permissionReport = permissions.some((p) => p === "REPORTAR");
  const permissionApprove = permissions.some((p) => p === "APROBAR");
  const permissionDisapprove = permissions.some((p) => p === "DESAPROBAR");

  // --- ESTADOS ---
  const [change, setChange] = useState(searchParams.get("select") || "");
  const [contratoSeleccionado, setContratoSeleccionado] = useState(searchParams.get("contrato") || "");

  // Cargar contratos al montar
  useEffect(() => {
    dispatch(getAllContratosAlmacen());
  }, [dispatch]);

  const contratos = useSelector((state) => state.almacen.allContratos);
  const contratoSede = contratos.filter((c) => c.sedeId.nombre === submodule);
  const contratoOptions = contratoSede.map((c) => c.cliente);

  // --- EFECTO DE NAVEGACIÓN (Sincronización con URL) ---
  useEffect(() => {
    const vista = searchParams.get("select");
    if (!vista) {
      if (permissionRead) {
        setChange("Movimientos");
        setSearchParams({ select: "Movimientos" });
      } else if (permissionCreate) {
        setChange("Registrar");
        setSearchParams({ select: "Registrar" });
      }
    } else {
      setChange(vista);
    }
  }, [permissionRead, permissionCreate, searchParams, setSearchParams]);

  // --- OPCIONES DEL MENÚ (Dinámicas según permisos) ---
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const newOptions = [];
    if (permissionRead) newOptions.push("Movimientos");
    if (permissionCreate) newOptions.push("Registrar");
    newOptions.push("Ubicar"); // Opción pública o según lógica interna
    newOptions.push("Stock");  // Opción pública o según lógica interna
    if (permissionReport) newOptions.push("Reporte");
    setOptions(newOptions);
  }, [permissionRead, permissionCreate, permissionReport]);

  const handleOptionClick = (option) => {
    setChange(option);
    const newParams = { select: option };
    if (option === "Movimientos" && contratoSeleccionado) {
      newParams.contrato = contratoSeleccionado;
    }
    setSearchParams(newParams);
  };

  // --- RENDERIZADO DE HIJOS (Switch Case) ---
  let children;
  switch (change) {
    case "Registrar":
      children = <RegisterLurin contratos={contratoOptions} contratos_id={contratoSede} />;
      break;
    case "Ubicar":
      children = <VistaGeneral />;
      break;
    case "Movimientos":
      // Evitamos renderizar si faltan datos de contratos para esta vista específica
      children = contratoSede.length > 0 ? (
        <ListLurin
          contratos={contratoOptions}
          contratos_id={contratoSede}
          contratoSeleccionado={contratoSeleccionado}
          setContratoSeleccionado={setContratoSeleccionado}
          permissionRead={permissionRead}
          permissionEdit={permissionEdit}
          permissionDelete={permissionDelete}
          permissionApprove={permissionApprove}
          permissionDisapprove={permissionDisapprove}
        />
      ) : <div className="p-6">Cargando datos de movimientos...</div>;
      break;
    case "Reporte":
      children = <ReporteMovimientos contratos={contratoOptions} contratos_id={contratoSede} />;
      break;
    case "Stock":
      children = (
        <StockAlmacenLurin
          permissionRead={permissionRead}
          permissionEdit={permissionEdit}
          permissionDelete={permissionDelete}
          permissionApprove={permissionApprove}
          permissionDisapprove={permissionDisapprove}
        />
      );
      break;
    default:
      children = <div className="p-10 text-center text-gray-400">Seleccione una opción válida</div>;
  }

  return (
    <div className="w-full">
      <PopUp />
      <div className="flex justify-center items-center p-5">
        <RadioOption
          opciones={options}
          selectedOption={change}
          onChange={handleOptionClick}
        />
      </div>
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default Lurin;