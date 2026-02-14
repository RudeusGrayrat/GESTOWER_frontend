import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import EditInventario from "../Permissions/Edit";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ListInventario = ({
  permissionRead,
  permissionEdit,
  permissionDelete,
}) => {
  const sendMessage = useSendMessage();
  const fetchData = async (page, limit, search) => {
    try {
      const response = await axios.get("/sistemas/getInventarioPaginacion", {
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
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      permissionDelete={permissionDelete}
      EditItem={EditInventario}
      DetailItem={null}
      fetchData={fetchData}
      reload={fetchData}
    >
      <Column
        field="codigo"
         
        header="Código"
        sortable
      />
      <Column field="categoria" header="Categoría" sortable />
      <Column field="marca" header="Marca" sortable />
      <Column field="modelo" header="Modelo" sortable />
      <Column field="cantidad" header="Cantidad" sortable />
      <Column
        field="estado"
        body={(rowData) => {
          const color =
            rowData.estado === "ACTIVO" ? " text-green-500 " : " text-red-500 ";

          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.estado}
            </div>
          );
        }}
        header="Estado"
        sortable
      />
    </ListPrincipal>
  );
};
export default ListInventario;
