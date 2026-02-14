import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const ListPlantas = () => {
    const fetchData = async (limit, page, search) => {
        try {
            const response = await axios.get("/certificaciones/getManifiestosPaginacion", {
                params: {
                    limit,
                    page,
                    search,
                },
            });
            const data = response.data;
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
            fetchData={fetchData}
            title="plantas_certificacion"
        >
            <Column field="denominacion" header="Denominación" />
            <Column field="direccion" header="Dirección" />
            <Column field="sector" header="Sector" />
            <Column field="ubigeo" header="Ubigeo" />
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

export default ListPlantas;