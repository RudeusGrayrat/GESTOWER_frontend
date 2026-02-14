import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEmployees } from "../../../../redux/actions";
import EditPermisos from "../Permission/Edit";
import DetailPermisos from "../Permission/Detaile";

const ListPermisos = ({ permissionEdit, permissionRead }) => {
  const colaboradores = useSelector((state) => state.recursosHumanos.employees);
  const dispatch = useDispatch();
  useEffect(() => {
    if (colaboradores.length === 0) {
      dispatch(getEmployees());
    }
  }, [colaboradores]);

  return (
    <ListPrincipal
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      content={colaboradores}
      reload={() => {
        dispatch(getEmployees());
      }}
      EditItem={EditPermisos}
      DetailItem={DetailPermisos}
    >
      <Column
        field="lastname"
        header="Apellidos"
        sortable
         
      />
      <Column field="name" header="Nombres" sortable />
      <Column field="charge" header="Cargo" sortable />
      <Column
        header="Permisos"
        sortable
        body={(rowData) => {
          const isEmpty = rowData.modules?.length > 0;
          const color = isEmpty ? "text-green-500" : "text-red-500";
          return (
            <span
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {isEmpty ? "SI" : "NO"}
            </span>
          );
        }}
      />
    </ListPrincipal>
  );
};

export default ListPermisos;
