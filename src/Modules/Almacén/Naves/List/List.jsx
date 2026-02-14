import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";
import DeleteNaveAlmacen from "../Permissions/DeleteNave";

const ListNaves = ({ permissionRead, permissionEdit, permissionDelete }) => {
  const sendMessage = useSendMessage();
  const recargar = async (page, limit, search) => {
    try {
      const response = await axios.get("/getNavesAlmacenPagination", {
        params: { page, limit, search },
      });
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    } catch (error) {
      sendMessage(error.message || "Error", "Error");
    }
  };

  return (
    <ListPrincipal
      permissionEdit={permissionEdit}
      permissionDelete={permissionDelete}
      permissionRead={permissionRead}
      DeleteItem={DeleteNaveAlmacen}
      fetchData={recargar}
      reload={recargar}
    >
      <Column
        field="nombre"
        header="Nombre Nave"
        sortable
      />
      <Column field="sedeId.nombre" header="Sede" sortable />
    </ListPrincipal>
  );
};

export default ListNaves;
