import { useAuth } from "../../../context/AuthContext";
import Enviar from "./Enviar/Enviar";
import ListBoletaDePagos from "./List/List";
import RegisterBoletaDePagos from "./Register/Register";
import { useEffect, useState } from "react";
import ReporteBoletasDePago from "./Report/Reporte";
import ExcelBoletas from "./Permissions/ExcelBoletas";
import RadioOption from "../../../recicle/Otros/Radio";
import { useSearchParams } from "react-router-dom";
import PopUp from "../../../recicle/popUps";

const BoletaDePagos = () => {
  const { user } = useAuth();
  const [change, setChange] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const hasPermission = () => {
    if (user) {
      const { modules } = user;

      const hasPermission1 = modules?.filter(
        (module) => module.submodule?.name === "BOLETA DE PAGOS"
      );
      const hasPermission2 = hasPermission1[0]?.submodule?.permissions;
      return hasPermission2;
    }
  };
  const permissionCreate = hasPermission()?.some(
    (permission) => permission === "CREAR"
  );
  const permissionRead = hasPermission()?.some(
    (permission) => permission === "VER"
  );
  const permissionReport = hasPermission()?.some(
    (permission) => permission === "REPORTAR"
  );
  const permissionEdit = hasPermission()?.some(
    (permission) => permission === "EDITAR"
  );
  const permissionDelete = hasPermission()?.some(
    (permission) => permission === "ELIMINAR"
  );
  const permissionApprove = hasPermission()?.some(
    (permission) => permission === "APROBAR"
  );
  const permissionDisapprove = hasPermission()?.some(
    (permission) => permission === "DESAPROBAR"
  );

  useEffect(() => {
    const vistaSeleccionada = searchParams.get("select");
    if (vistaSeleccionada) {
      setChange(vistaSeleccionada);
    } else if (permissionRead) {
      setChange("Listar");
    } else if (permissionCreate) {
      setChange("Crear");
    } else if (permissionReport) {
      setChange("Reporte");
    } else {
      setChange("No hay Opciones Disponibles");
    }
  }, [searchParams, permissionRead, permissionCreate, permissionReport]);
  let children;
  if (change === "Crear") {
    children = <RegisterBoletaDePagos />;
  } else if (change === "Listar") {
    children = (
      <ListBoletaDePagos
        permissionRead={permissionRead}
        permissionEdit={permissionEdit}
        permissionDelete={permissionDelete}
        permissionApprove={permissionApprove}
        permissionDisapprove={permissionDisapprove}
      />
    );
  } else if (change === "Reporte") {
    children = <ReporteBoletasDePago />;
  } else if (change === "Enviar") {
    children = <Enviar />;
  } else if (change === "Excel") {
    children = <ExcelBoletas />;
  } else {
    children = "No hay nada";
  }
  const options = ["Listar", "Crear", "Reporte", "Enviar", "Excel"];
  const handleOptionClick = (option) => {
    setSearchParams({ select: option });

    setChange(option);
  };

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
      {children}
    </div>
  );
};

export default BoletaDePagos;
