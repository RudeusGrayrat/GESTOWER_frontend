import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import DetailManifiestoPermissions from "../Permissions/Detail";

const ListManifiestos = () => {
    return (
        <ListPrincipal
            DetailItem={DetailManifiestoPermissions} >
            <Column field="id" header="ID"/>
            <Column field="nombre" header="Nombre"/>
            <Column field="fechaCreacion" header="Fecha de Creación"/>
            <Column field="estado" header="Estado"/>
            
        </ListPrincipal>
    );
}

export default ListManifiestos;