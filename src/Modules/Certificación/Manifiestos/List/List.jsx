import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailManifiesto from "../Permissions/Detail";

const ListManifiestos = ({
    permissionRead,
    permissionEdit,
    permissionDelete
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

    const estadoTemplate = (rowData) => {
        const severities = {
            'REGISTRADO': 'info',
            'EN_TRANSPORTE': 'warning',
            'RECIBIDO': 'success',
            'PROCESADO': 'success',
            'CERRADO': 'secondary'
        };

        const labels = {
            'REGISTRADO': 'Registrado',
            'EN_TRANSPORTE': 'En Transporte',
            'RECIBIDO': 'Recibido',
            'PROCESADO': 'Procesado',
            'CERRADO': 'Cerrado'
        };

        return <Tag value={labels[rowData.estado] || rowData.estado} severity={severities[rowData.estado]} />;
    };

    const generadorTemplate = (rowData) => {
        return rowData.generadorId?.razonSocial || 'N/A';
    };

    return (
        <ListPrincipal
            permissionRead={permissionRead}
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            DetailItem={DetailManifiesto}
            fetchData={fetchManifiestos}
            editPath="/certificaciones/patchManifiesto"
            deletePath="/certificaciones/deleteManifiesto"
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
            <Column field="estado" header="Estado" body={estadoTemplate} sortable />
        </ListPrincipal>
    );
};

export default ListManifiestos;