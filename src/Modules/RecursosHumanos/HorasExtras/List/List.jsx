import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"

const ListHorasExtras = () => {
    return (
        <ListPrincipal>
            <Column field="id" header="ID" />
            <Column field="colaborador" header="Colaborador" />
            <Column field="fecha" header="Fecha" />
            <Column field="horasExtras" header="Horas Extras" />
        </ListPrincipal>
    )
}

export default ListHorasExtras