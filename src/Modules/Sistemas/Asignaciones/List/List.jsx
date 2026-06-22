import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";

const ListAsignaciones = ({
  permissionRead,
  permissionEdit,
  permissionApprove,
  permissionDisapprove,
}) => {
  const fetchData = async ({ page, limit, search }) => {
    try {
      const response = await axios.get("/getAsignacionesPaginación", {
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
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      fetchData={fetchData}
      content={[]}
    >
      <Column field="name" header="Nombre"  />
    </ListPrincipal>
  );
};

export default ListAsignaciones;
