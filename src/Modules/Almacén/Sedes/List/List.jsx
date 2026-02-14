import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeleteSedeAlmacen from "../Permissions/DeleteSedes";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ListSedesAlmacen = ({
  permissionRead,
  permissionDelete,
  permissionEdit,
}) => {
  const sendMessage = useSendMessage();
  const recargar = async (page, limit, search) => {
    try {
      const response = await axios.get("/getSedesAlmacenPagination", {
        params: { page, limit, search },
      });
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    } catch (error) {
      sendMessage(error.message || "Error ", "Error");
    }
  };
  return (
    <ListPrincipal
      permissionRead={permissionRead}
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      DeleteItem={DeleteSedeAlmacen}
      fetchData={recargar}
      reload={recargar}
    >
      <Column field="_id" header="ID"   />
      <Column field="nombre" header="Nombre" />
      <Column field="direccion" header="Dirección" />
      <Column field="estado" header="Estado" />
    </ListPrincipal>
  );
};

export default ListSedesAlmacen;
