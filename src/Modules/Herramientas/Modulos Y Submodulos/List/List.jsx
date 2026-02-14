import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeleteSubmodule from "../Permissions/DeleteSubmodule";
import axios from "../../../../api/axios.js";

const List = ({ permissionEdit, permissionDelete }) => {
  const fetchMyS = async (page, limit, search) => {
    try {

      const response = await axios.get("/herramientas/getSubmodulesPagination", {
        params: { page, limit, search },
      });
      console.log("response: ", response);
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <ListPrincipal
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      DeleteItem={DeleteSubmodule}
      fetchData={fetchMyS}
      reload={fetchMyS}
    >
      <Column
        field="module"
        header="Modulo"
        sortable
         
      />
      <Column field="name" header="Submodulo" sortable />
    </ListPrincipal>
  );
};

export default List;
