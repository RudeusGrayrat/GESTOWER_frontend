import { Column } from "primereact/column";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditEmployee from "../Permissions/EditEmployee";
import ListPrincipal from "../../../../components/Principal/List/List";
import DetailEmployee from "../Permissions/DetailEmployee";
import Inactive from "../Permissions/Inactive";
import Active from "../Permissions/Active";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const List = ({
  permissionEdit,
  permissionRead,
  permissionApprove,
  permissionDisapprove,
}) => {
  
  const sendMessage = useSendMessage();
  const fetchData = async (page, limit, search) => {
    try {
      const reponse = await axios.get("/getEmployeeByParams", {
        params: {
          page,
          limit,
          search,
        },
      });
      return {
        data: reponse.data?.data,
        total: reponse.data?.total,
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
      permissionRead={permissionRead}
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      ApproveItem={Active}
      DisapproveItem={Inactive}
      EditItem={EditEmployee}
      DetailItem={DetailEmployee}
      fetchData={fetchData}
      reload={fetchData}
    >
      <Column
        field="lastname"
        header="Apellidos"
         
      ></Column>
      <Column field="name" header="Nombres"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="business" header="Empresa"></Column>
      <Column
        field="state"
        header="Estado"
        style={{ justifyItems: "center" }}
        body={(rowData) => {
          const color =
            rowData.state === "ACTIVO" ? " text-green-500 " : " text-red-500 ";

          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.state}
            </div>
          );
        }}
      ></Column>
    </ListPrincipal>
  );
};

export default List;
