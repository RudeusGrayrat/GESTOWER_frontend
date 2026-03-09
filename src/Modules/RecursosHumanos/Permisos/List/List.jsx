import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"
import axios from "../../../../api/axios"
import DetailPermisos from "../Permissions/Detail"

const ListPermisos = ({
    permissionApprove,
    permissionDelete,
    permissionDisapprove,
    permissionEdit,
    permissionRead,
    permissionSend
}) => {
    const fetchData = async (page, limit, search) => {
        try {
            const response = await axios.get("/rrhh/getPermisosPaginacion", {
                params: {
                    page,
                    limit,
                    search
                }
            });
            const data = response.data || { data: [], total: 0 };
            return {
                data: data.data,
                total: data.total
            };
        } catch (error) {
            throw error;
        }
    }
    return (
        <ListPrincipal
            permissionApprove={permissionApprove}
            permissionDelete={permissionDelete}
            permissionDisapprove={permissionDisapprove}
            permissionEdit={permissionEdit}
            permissionRead={permissionRead}
            permissionSend={permissionSend}
            DetailItem={DetailPermisos}
            fetchData={fetchData}
            title="permisos_list_rrhh"
        >
            <Column field="colaborador.name" header="Nombres" />
            <Column field="colaborador.lastname" header="Apellidos" />
            <Column field="fechaInicio" header="Fecha Inicio" />
            <Column field="fechaFin" header="Fecha Fin" />
            <Column field="duracionHoras" header="Duración en Horas" />
            <Column field="estado" header="Estado" />
        </ListPrincipal>
    )
}

export default ListPermisos