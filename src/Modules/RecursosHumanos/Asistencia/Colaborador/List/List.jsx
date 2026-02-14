import { useEffect, useState } from "react";
import ListPrincipal from "../../../../../components/Principal/List/List";
import EditAsistenciaColaborador from "../Permissions/Edit";
import DeleteAsistenciaColaborador from "../Permissions/Delete";
import DetailAsistenciaColaborador from "../Permissions/Detail";
import { Column } from "primereact/column";
import axios from "../.././../../../api/axios";
import useSendMessage from "../../../../../recicle/senMessage";

const ListAColaborador = ({
  permissionEdit,
  permissionDelete,
  permissionRead,
}) => {
  const sendMessage = useSendMessage();

  const fetchBoletas = async (page, limit, search) => {
    try {
      const response = await axios.get("/getAsistenciaByParams", {
        params: { page, limit, search },
      });

      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    } catch (error) {
      sendMessage(
        error.message || "Error al recargar la lista de colaboradores",
        "Error"
      );
    }
  };
  return (
    <ListPrincipal
      permissionEdit={permissionEdit}
      permissionDelete={permissionDelete}
      permissionRead={permissionRead}
      DeleteItem={DeleteAsistenciaColaborador}
      EditItem={EditAsistenciaColaborador}
      DetailItem={DetailAsistenciaColaborador}
      fetchData={fetchBoletas}
      reload={fetchBoletas}
    >
      <Column
        field="colaborador.lastname"
        header="Apellidos del Colaborador"
         
      />
      <Column field="colaborador.name" header="Nombres del Colaborador" />

      <Column field="fecha" header="Fecha" />
      <Column field="ingreso" header="Hora de Ingreso" />
      <Column field="inicioAlmuerzo" header="Inicio de Almuerzo" />
      <Column field="finAlmuerzo" header="Fin de Almuerzo" />
      <Column field="salida" header="Hora de Salida" />
      <Column
        field="state"
        header="Estado"
        style={{ justifyItems: "center" }}
        body={(rowData) => {
          let color;
          "PRESENTE", "FALTA", "TARDANZA", "PERMISO", "VACACIONES";
          switch (rowData.estado) {
            case "PRESENTE":
              color = " text-green-500 ";
              break;
            case "TARDANZA":
              color = " text-orange-500 ";
              break;
            case "FALTA":
              color = "text-red-500 ";
              break;
            case "PERMISO":
              color = " text-blue-500 ";
              break;
            case "VACACIONES":
              color = " text-yellow-500 ";
              break;
            default:
              color = " text-gray-500 ";
          }
          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.estado}
            </div>
          );
        }}
      ></Column>
    </ListPrincipal>
  );
};

export default ListAColaborador;
