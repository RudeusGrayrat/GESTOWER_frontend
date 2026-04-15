import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"
import axios from "../../../../api/axios";
import DetailHorasExtras from "../Permissions/Detail";
import ApproveHorasExtras from "../Permissions/Approve";
import SendHorasExtras from "../Permissions/Send";
import EditHorasExtras from "../Permissions/Edit";
import DissaproveHorasExtras from "../Permissions/Dissaprove";
import DeletehorasExtras from "../Permissions/Delete";

const ListHorasExtras = ({
    permissionRead,
    permissionDelete,
    permissionApprove,
    permissionDisapprove,
    permissionEdit,
    permissionSend,
    user,
}) => {
    const sede = user.sede
    const fetchData = async (page, limit, search) => {
        try {
            const response = await axios.get("/rrhh/getHorasExtrasPaginacion", {
                params: {
                    page,
                    limit,
                    search,
                    sede
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
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            permissionEdit={permissionEdit}
            permissionSend={permissionSend}
            DetailItem={DetailHorasExtras}
            EditItem={EditHorasExtras}
            DisapproveItem={DissaproveHorasExtras}
            ApproveItem={ApproveHorasExtras}
            DeleteItem={DeletehorasExtras}
            fetchData={fetchData}
            EnviarItem={SendHorasExtras}
            title="horas_etxras_list"
        >
            <Column field="fecha" header="Fecha" />
            <Column field="solicitante" header="Solicitante" body={(rowData) => rowData.solicitante ? `${rowData.solicitante.name} ${rowData.solicitante.lastname}` : "N/A"} />
            <Column field="retribucion" header="Retribución" />
            {/* En motivo debe de ser solo maximo 50 palabras visibles */}
            <Column field="motivo" header="Motivo" body={(rowData) => rowData.motivo ? (rowData.motivo.length > 40 ? `${rowData.motivo.substring(0, 40)}...` : rowData.motivo) : "N/A"} />
            <Column header="N° colaboradores" body={(rowData) => rowData.colaboradores ? rowData.colaboradores.length : 0} />
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
                        case "ENVIADO":
                            color = "text-blue-500";
                            break;
                        case "APROBADO":
                            color = "text-green-600";
                            break;
                        case "RECHAZADO":
                            color = "text-red-500";
                            break;
                        default:
                            color = "text-gray-300";
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

export default ListHorasExtras