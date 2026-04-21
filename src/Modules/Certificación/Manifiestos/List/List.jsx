import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailManifiesto from "../Permissions/Detail";
import AprobarManifiesto from "../Permissions/Aprobar";
import EditManifiesto from "../Permissions/EditManifiesto";
import RechazarManifiesto from "../Permissions/Rechazar";

const ListManifiestos = ({
    permissionRead,
    permissionEdit,
    permissionDelete,
    permissionApprove,
    permissionDisapprove,
    permissionSend
}) => {
    const fetchManifiestos = async (page, rows, filters, sortField, sortOrder) => {
        try {
            const params = {
                page,
                limit: rows,
                sortField,
                sortOrder: sortOrder === 1 ? 'asc' : 'desc',
                ...filters
            };

            const response = await axios.get("/certificaciones/getManifiestosPaginacion", { params });
            return {
                data: response.data.data || [],
                total: response.data.total || 0
            };
        } catch (error) {
            console.error("Error fetching manifiestos:", error);
            throw error;
        }
    };
    const generadorTemplate = (rowData) => {
        return rowData.generadorId?.razonSocial || 'N/A';
    };
    return (
        <ListPrincipal
            permissionRead={permissionRead}
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            permissionSend={permissionSend}
            ApproveItem={AprobarManifiesto}
            DisapproveItem={RechazarManifiesto}
            DetailItem={DetailManifiesto}
            EditItem={EditManifiesto}
            fetchData={fetchManifiestos}
        >
            <Column field="numeroManifiesto" header="N° Manifiesto" sortable />
            <Column field="generadorId" header="Generador" body={generadorTemplate} sortable />
            <Column field="residuo.descripcion" header="Residuo" />
            <Column
                field="transporte.fechaRecepcion"
                header="Fecha Recepción"
                body={(row) => row.transporte?.fechaRecepcion ? new Date(row.transporte.fechaRecepcion).toLocaleDateString() : '-'}
            />
            <Column
                field="createdAt"
                header="Fecha Registro"
                body={(row) => new Date(row.createdAt).toLocaleDateString()}
                sortable
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
                            color = "text-yellow-500";
                            break;
                        case "RECHAZADO":
                            color = "text-red-500";
                            break;
                        case "APROBADO":
                            color = "text-green-500";
                            break;
                        case "OBSERVADO":
                            color = "text-orange-500";
                            break;
                        case "ENVIADO":
                            color = "text-blue-500";
                            break;
                        case "EN REVISION":
                            color = "text-purple-500";
                            break;
                        default:
                            color = "text-gray-500";
                    }

                    return (
                        <div
                            className={`text-center bg-gradient-to-tr from-white to-gray-100 
                            shadow-inner rounded-xl font-medium  px-5 py-1  ${color} `}
                        >
                            {rowData.estado}
                        </div>
                    );
                }}
            />
        </ListPrincipal>
    );
};

export default ListManifiestos;