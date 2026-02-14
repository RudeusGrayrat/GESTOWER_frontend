import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ViewBoletaDePago from "../Permissions/View";
import EditBoletaDePagos from "../Permissions/Edit";
import DeleteBoletaDePagos from "../Permissions/Delete";
import dayjs from "dayjs";
import "dayjs/locale/es";
import ApproveBoletaDePago from "../Permissions/Approve";
import DisapproveBoletaDePago from "../Permissions/Disapprove";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";
import { getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";
const ListBoletaDePagos = ({
  permissionEdit,
  permissionDelete,
  permissionRead,
  permissionApprove,
  permissionDisapprove
}) => {
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();

  const datosContables = useSelector(
    (state) => state.recursosHumanos.datosContables
  );
  const recargar = async (page, limit, search) => {
    try {
      const response = await axios.get("/getBoletaDePagoByParams", {
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
  useEffect(() => {
    if (datosContables.length === 0) dispatch(getDatosContables());
  }, [datosContables]);

  return (
    <ListPrincipal
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      EditItem={EditBoletaDePagos}
      DetailItem={ViewBoletaDePago}
      DeleteItem={DeleteBoletaDePagos}
      ApproveItem={ApproveBoletaDePago}
      DisapproveItem={DisapproveBoletaDePago}
      fetchData={recargar}
      reload={recargar}
    >
      <Column
        field="correlativa"
        header="Correlativa"
         
      />
      <Column
        field="fechaBoletaDePago"
        header="Fecha de la Boleta"
        body={(rowData) => {
          if (rowData.fechaBoletaDePago) {
            const [mes, año] = rowData.fechaBoletaDePago.split("/");
            const fechaFormateada = `${año}-${mes}`;
            dayjs.locale("es");
            const newFecha = dayjs(fechaFormateada).format("MMMM [de] YYYY");
            const newFechaCapitalizada =
              newFecha.charAt(0).toUpperCase() + newFecha.slice(1);
            return <span>{newFechaCapitalizada}</span>;
          }
        }}
      />

      <Column field="colaborador.lastname" header="Apellidos del Colaborador" />
      <Column field="colaborador.name" header="Nombres del Colaborador" />
      <Column field="colaborador.business" header="Empresa" />
      <Column
        field="envio"
        body={(rowData) => {
          return <span>{rowData.envio || "-----"}</span>;
        }}
        header="Enviado"
      />
      <Column
        field="recepcion"
        body={(rowData) => {
          return <span>{rowData.recepcion || "-----"}</span>;
        }}
        header="Recibido"
      />
      <Column
        field="state"
        header="Estado"
        style={{
          justifyItems: "center",
          // display: window.innerWidth <= 1250 ? "none" : "table-cell",
        }}
        body={(rowData) => {
          const color =
            rowData.state === "APROBADO"
              ? " text-green-500 "
              : " text-red-500 ";

          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.state}
            </div>
          );
        }}
      />
    </ListPrincipal>
  );
};
export default ListBoletaDePagos;
