import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllWidgets } from "../../../../redux/actions";
import EditWidget from "../Permissions/Edit";
import DeleteWidget from "../Permissions/Delete";

const ListWidgets = (permissionEdit, permissionDelete, permissionRead) => {
  const allWidgets = useSelector((state) => state.sistemas.allWidgets);

  const dispatch = useDispatch();
  useEffect(() => {
    if (allWidgets.length === 0) {
      dispatch(getAllWidgets());
    }
  }, [allWidgets, dispatch]);
  return (
    <ListPrincipal
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      ApproveItem={null}
      DisapproveItem={null}
      DeleteItem={DeleteWidget}
      EditItem={EditWidget}
      DetailItem={null}
      content={allWidgets}
      reload={() => dispatch(getAllWidgets())}
      sortField="createdAt"
      sortOrder={-1}
    >
      <Column
        field="name"
         
        header="Nombre"
        sortable
      />
      <Column field="imagen" header="Url Imagen" sortable />
      <Column field="grupo" header="Grupo" sortable />
      <Column field="createdAt" header="Fecha de Creacion" sortable />
    </ListPrincipal>
  );
};

export default ListWidgets;
