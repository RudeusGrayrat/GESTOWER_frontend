import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailGenerador from "../Permissions/Permissions";

const ListGeneradores = ({
    permissionRead,
    permissionEdit,
    permissionDelete
}) => {
    const fecthGeneradores = async ({ limit, page, search }) => {
        try {
            const response = await axios.get("/certificaciones/getGeneradoresPaginacion", {
                params: { limit, page, search }
            });
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
            DetailItem={DetailGenerador}
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