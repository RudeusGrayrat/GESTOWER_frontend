import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const ListGeneradores = ({
    permissionRead,
    permissionEdit,
    permissionDelete
}) => {
    const fecthGeneradores = async () => {
        try {
            const response = await axios.get("/certificaciones/getGeneradoresPaginacion");
            const data = response.data;
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
            permissionRead={permissionRead}
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            fetchData={fecthGeneradores}
        >
            <Column field="razonSocial" header="Razon Social" />
            <Column field="ruc" header="RUC" />
            <Column field="correoElectronico" header="Correo Electrónico" />
            <Column field="representanteLegal" header="Representante Legal" />
        </ListPrincipal>
    )
}

export default ListGeneradores;