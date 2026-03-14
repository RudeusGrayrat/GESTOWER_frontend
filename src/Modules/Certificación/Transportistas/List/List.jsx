import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailTransportista from "../Permissions/Detail";
import EditTransportistas from "../Permissions/Edit";

const ListTransportistas = ({
    permissionRead, permissionApprove, permissionEdit, permissionDelete, permissionDisapprove
}) => {
    const fetchData = async (limit, page, search) => {
        try {
            const response = await axios.get("/certificaciones/getTransportistasPaginacion", {
                params: {
                    limit,
                    page,
                    search,
                },
            });
            const data = response.data;
            console.log("Data recibida del backend:", data);
            return {
                data: data.data,
                total: data.total,
            };
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
            DetailItem={DetailTransportista}
            fetchData={fetchData}
            EditItem={EditTransportistas}
            title="transportistas_certificacion"
        >
            <Column field="razonSocial" header="Razón Social" />
            <Column field="ruc" header="RUC" />
            <Column field="direccion" header="Dirección" />
            <Column field="ubigeoId.codigo" header="Ubigeo" />
            <Column
                field="estado"
                header="Estado"
                style={{
                    justifyItems: "center",
                    // display: window.innerWidth <= 1250 ? "none" : "table-cell",
                }}
                body={(rowData) => {
                    const color =
                        rowData.estado === "ACTIVO"
                            ? " text-green-500 "
                            : " text-red-500 ";

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

export default ListTransportistas;