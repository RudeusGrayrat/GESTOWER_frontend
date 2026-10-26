import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailGenerador from "../Permissions/Permissions";
import EditGenerador from "../Permissions/Edit";
import ApproveGenerador from "../Permissions/Approve";
import DisapproveGenerador from "../Permissions/Disapprove";

const ListGeneradores = ({
    permissionRead,
    permissionEdit,
    permissionDelete,
    permissionApprove,
    permissionDisapprove
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
            permissionApprove={permissionApprove}
            permissionDisapprove={permissionDisapprove}
            canApprove={(row) => ["PENDIENTE", "SUSPENDIDO"].includes(row.estado)}
            canDisapprove={(row) => ["PENDIENTE", "ACTIVO"].includes(row.estado)}
            DetailItem={DetailGenerador}
            EditItem={EditGenerador}
            ApproveItem={ApproveGenerador}
            DisapproveItem={DisapproveGenerador}
            fetchData={fecthGeneradores}
        >
            <Column field="razonSocial" header="Razon Social" />
            <Column field="ruc" header="RUC" />
            <Column field="correoElectronico" header="Correo Electrónico" />
            <Column field="representanteLegal" header="Representante Legal" />
            <Column
                field="estado"
                body={(rowData) => {
                    const color = rowData.estado === "ACTIVO"
                        ? " text-green-500 "
                        : rowData.estado === "PENDIENTE" ? " text-amber-500 " : " text-red-500 ";

                    return (
                        <div
                            className={`text-center max-w-40 bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
                        >
                            {rowData.estado}
                        </div>
                    );
                }}
                header="Estado"
                
            />
        </ListPrincipal>
    )
}

export default ListGeneradores;
