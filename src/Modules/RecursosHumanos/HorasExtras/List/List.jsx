import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"
import axios from "../../../../api/axios";
import DetailHorasExtras from "../Permissions/Detail";

const ListHorasExtras = ({
    permissionRead,
    permissionDelete,
    permissionApprove,
    permissionDisapprove,
    permissionEdit,
    permissionSend
}) => {
    const fetchData = async (page, limit, search) => {
        try {
            const response = await axios.get("/rrhh/getHorasExtrasPaginacion", {
                params: {
                    page,
                    limit,
                    search
                }
            });
            const data = response.data
            return {
                data: data.data,
                total: data.total
            }

        } catch (error) {
            throw error
        }
    }
    return (
        <ListPrincipal
            permissionRead={permissionRead}
            permissionDelete={permissionDelete}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            permissionEdit={permissionEdit}
            permissionSend={permissionSend}
            DetailItem={DetailHorasExtras}
            fetchData={fetchData}
            title="horas_etxras_list"
        >
            <Column field="fecha" header="Fecha" />
            <Column field="colaborador.name" header="Nombres" />
            <Column field="colaborador.lastname" header="Apellidos" />
            <Column field="colaborador.documentNumber" header="DNI del Colaborador" />
            <Column field="minutosTotales" header="Tiempo "
                body={(rowData) => {
                    const minutosTotales = rowData.minutosTotales || 0;
                    return `${minutosTotales} minutos`;
                }}
            />
        </ListPrincipal>
    )
}

export default ListHorasExtras