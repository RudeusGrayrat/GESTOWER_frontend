import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"
import axios from "../../../../api/axios"
import DetailPermisos from "../Permissions/Detail"
import ApprovePermisos from "../Permissions/Approve"

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
            const data = response.data;
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
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            permissionSend={permissionSend}
            DetailItem={DetailPermisos}
            ApproveItem={ApprovePermisos}
            fetchData={fetchData}
            title="permisos_list_rrhh"
        >
            <Column field="colaborador.name" header="Nombres" />
            <Column field="colaborador.lastname" header="Apellidos" />
            <Column field="fechaInicio" header="Fecha Inicio" />
            <Column field="fechaFin" header="Fecha Fin" />
            <Column field="duracionHoras" header="Duración"
                body={(rowData) => `${rowData.duracionHoras} horas`}
            />
            <Column
                field="estado"
                header="Estado"
                style={{
                    justifyItems: "center",
                }}
                body={(rowData) => {
                    let color = "";
                    switch (rowData.estado) {
                        case "PENDIENTE":
                            color = "text-red-500";
                            break;
                        case "APROBADO":
                            color = "text-green-600";
                            break;
                        case "RECHAZADO":
                            color = "text-gray-500";
                            break;
                        default:
                            color = "text-gray-900";
                    }
                    return (
                        <div
                            className={`text-center bg-gradient-to-tr from-white to-gray-100
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
                        >
                            {rowData.estado}
                        </div>
                    );
                }}
            />
        </ListPrincipal>
    )
}

export default ListPermisos