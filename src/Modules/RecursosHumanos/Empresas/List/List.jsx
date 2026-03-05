import { Column } from "primereact/column";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import View from "../Permissions/View";
import EditBusiness from "../Permissions/Edit";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const List = ({ permissionEdit, permissionDelete, permissionRead }) => {

  const fetchData = async ({ page, limit, search }) => {
    try {
      const response = await axios("/rrhh/getBusinessPaginacion",
        { params: { page, limit, search } }
      )
      const data = response.data
      return {
        data: data.data,
        total: data.total
      }
    } catch (error) {
      throw error;
    }
  }
  return (
    <ListPrincipal
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      EditItem={EditBusiness}
      DetailItem={View}
      fetchData={fetchData}
    >
      <Column
        field="ruc"
        header="RUC"
        sortable
        style={{ minWidth: "8rem", paddingLeft: "60px" }}
      ></Column>
      <Column
        field="razonSocial"
        header="Razón Social"
        sortable
        style={{ minWidth: "12rem" }}
      ></Column>

      <Column
        field="representative.name"
        header="Representante"
        sortable
        style={{ minWidth: "18rem" }}
      ></Column>
      <Column
        field="domicilioFiscal"
        header="Dirección"
        sortable
        style={{ minWidth: "8rem" }}
      ></Column>
    </ListPrincipal>
  );
};

export default List;
