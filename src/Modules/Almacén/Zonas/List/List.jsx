import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeleteZonaAlmacen from "../Permissions/Delete";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ListZonas = ({ permissionRead, permissionEdit, permissionDelete }) => {
  const sendMessage = useSendMessage();

  const recargar = async (page, limit, search) => {
    try {
      const response = await axios.get("/getZonasPagination", {
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
      permissionRead={permissionRead}
      permissionEdit={permissionEdit}
      permissionDelete={permissionDelete}
      DeleteItem={DeleteZonaAlmacen}
      fetchData={recargar}
      reload={recargar}
    >
      <Column
        field="nombre"
        header="Nombre"
        sortable
         
      />
      <Column field="almacenId.nombre" header="Almacén" sortable />
      <Column field="orientacion" header="Orientación" sortable />
      <Column field="racks.length" header="Cantidad de Racks" sortable />
    </ListPrincipal>
  );
};

export default ListZonas;
