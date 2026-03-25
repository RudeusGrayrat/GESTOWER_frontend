import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailGenerador from "../Permissions/Permissions";
import EditGenerador from "../Permissions/Edit";

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
            EditItem={EditGenerador}
            fetchData={fecthGeneradores}
        >
            <Column field="razonSocial" header="Razon Social" />
            <Column field="ruc" header="RUC" />
            <Column field="correoElectronico" header="Correo Electrónico" />
            <Column field="representanteLegal" header="Representante Legal" />
            <Column
                field="estado"
                body={(rowData) => {
                    const color =
                        rowData.estado === "ACTIVO" ? " text-green-500 " : " text-red-500 ";

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
                sortable
            />
        </ListPrincipal>
    )
}

export default ListGeneradores;