import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import RadioOption from "../../../recicle/Otros/Radio";
import ListLurin from "./List/List";
import RegisterLurin from "./Register/Register";
import { getAllContratosAlmacen } from "../../../redux/modules/Almacen/actions";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import VistaGeneral from "./Ubicar/Vista";
import ReporteMovimientos from "./Report/Reporte";
import StockAlmacenLurin from "./Stock/Stock";
import PopUp from "../../../recicle/popUps";

const Lurin = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const submodule = "LURIN";
  const [searchParams, setSearchParams] = useSearchParams();

  const hasPermission = () => {
    const { modules } = user || {};
    const permisos = modules?.find((m) => m.submodule?.name === submodule)
      ?.submodule?.permissions;
    return permisos || [];
  };

  const permisos = hasPermission();

  const [change, setChange] = useState("");
  const [contratoSeleccionado, setContratoSeleccionado] = useState(
    searchParams.get("contrato") || ""
  );

  // Cargar contratos SIEMPRE al montar
  useEffect(() => {
    dispatch(getAllContratosAlmacen());
  }, [dispatch]);

  const contratos = useSelector((state) => state.almacen.allContratos);
  const contratoSede = contratos.filter(
    (contrato) => contrato.sedeId.nombre === submodule
  );
  const contratoOptions = contratoSede.map((c) => c.cliente);

  useEffect(() => {
    const vistaSeleccionada = searchParams.get("select");
    if (vistaSeleccionada) {
      setChange(vistaSeleccionada);
    } else if (permisos.includes("VER")) {
      setChange("Movimientos");
    } else if (permisos.includes("CREAR")) {
      setChange("Registrar");
    } else if (permisos.includes("REPORTAR")) {
      setChange("Reporte");
    } else {
      setChange("No hay Opciones Disponibles");
    }
  }, [searchParams, permisos]);

  const handleOptionClick = (option) => {
    if (option === "Movimientos") {
      setSearchParams({ select: option, contrato: contratoSeleccionado });
    } else {
      setSearchParams({ select: option });
    }
    setChange(option);
  };

  // No renderizar nada hasta que se tengan contratos
  if (!contratoSede.length && change === "Movimientos") {
    return <div className="p-6">Cargando Datos...</div>;
  }

  let children;
  if (change === "Registrar") {
    children = (
      <RegisterLurin contratos={contratoOptions} contratos_id={contratoSede} />
    );
  } else if (change === "Ubicar") {
    children = <VistaGeneral />;
  } else if (change === "Movimientos") {
    children = (
      <ListLurin
        contratos={contratoOptions}
        contratos_id={contratoSede}
        contratoSeleccionado={contratoSeleccionado}
        setContratoSeleccionado={setContratoSeleccionado}
        permissionRead={permisos.includes("VER")}
        permissionEdit={permisos.includes("EDITAR")}
        permissionDelete={permisos.includes("ELIMINAR")}
      />
    );
  } else if (change === "Reporte") {
    children = (
      <ReporteMovimientos
        contratos={contratoOptions}
        contratos_id={contratoSede}
      />
    );
  } else if (change === "Stock") {
    children = (
      <StockAlmacenLurin
        permissionRead={permisos.includes("VER")}
        permissionEdit={permisos.includes("EDITAR")}
        permissionDelete={permisos.includes("ELIMINAR")}
      />
    );
  } else {
    children = "No hay opciones disponibles para esta vista.";
  }

  const options = ["Movimientos", "Registrar", "Ubicar", "Stock", "Reporte"];

  return (
    <div className="w-full ">
      <PopUp />
      <div className="flex justify-center items-center p-5">
        <RadioOption
          opciones={options}
          selectedOption={change}
          onChange={handleOptionClick}
        />
      </div>
      {children}
    </div>
  );
};

export default Lurin;
