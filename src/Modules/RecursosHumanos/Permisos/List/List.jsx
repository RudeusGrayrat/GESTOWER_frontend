import { Column } from "primereact/column"
import ListPrincipal from "../../../../components/Principal/List/List"

const ListPermisos = () => {
    return (
        <ListPrincipal>
            <Column field="id" header="ID" />
            <Column field="colaborador" header="Colaborador" />
            <Column field="tipoPermiso" header="Tipo de Permiso" />
        </ListPrincipal>
    )
}

export default ListPermisos