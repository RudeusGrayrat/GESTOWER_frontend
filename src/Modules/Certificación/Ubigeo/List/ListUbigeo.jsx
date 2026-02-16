import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";

const ListUbigeo = () => {
    const fetchData = async (limit, page, search) => {
        try {
            const response = await axios.get("/certificaciones/getUbigeoPaginacion", {
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
            title="ubigeo_certificacion"
        >
            <Column field="codigo" header="Código" />
            <Column field="departamento" header="Departamento" />
            <Column field="provincia" header="Provincia" />
            <Column field="distrito" header="Distrito" />
        </ListPrincipal>
    );
}

export default ListUbigeo;