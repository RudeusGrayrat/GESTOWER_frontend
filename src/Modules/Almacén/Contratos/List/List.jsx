import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeleteContratoAlmacen from "../Permissions/DeleteContrato";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ListContratosAlmacen = ({
  permissionRead,
  permissionEdit,
  permissionDelete,
}) => {
  const sendMessage = useSendMessage();
  const fetch = async (page, limit, search) => {
    try {
      const reponse = await axios.get("/getContratosAlmacenPagination", {
        params: { page, limit, search },
      });
      return {
        data: reponse.data?.data,
        total: reponse.data?.total,
      };
    } catch (error) {
      sendMessage(error.message || "Error ", "Error");
    }
  };
  return (
    <ListPrincipal
      permissionRead={permissionRead}
      permissionEdit={permissionEdit}
      permissionDelete={permissionDelete}
      DeleteItem={DeleteContratoAlmacen}
      fetchData={fetch}
      reload={fetch}
    >
      <Column field="_id" header="ID"   />
      <Column field="cliente" header="Cliente" />
      <Column field="fechaInicio" header="Fecha Inicio" />
      <Column field="fechaFin" header="Fecha Fin" />
      <Column field="sedeId.nombre" header="Sede" />
      <Column field="estado" header="Estado" />
    </ListPrincipal>
  );
};

export default ListContratosAlmacen;
