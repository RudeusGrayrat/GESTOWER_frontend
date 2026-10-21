import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DetailGenerador from "../Permissions/Permissions";
import EditGenerador from "../Permissions/Edit";
import useSendMessage from "../../../../recicle/senMessage";
import { useState } from "react";

const ListGeneradores = ({
    permissionRead,
    permissionEdit,
    permissionDelete,
    permissionApprove
}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [activando, setActivando] = useState("");
    const sendMessage = useSendMessage();
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
    const activar = async (row) => {
        if (!window.confirm(`¿Activar a ${row.razonSocial}? Se habilitará su cuenta y vínculo con el transportista que lo registró.`)) return;
        setActivando(row._id);
        try {
            const { data } = await axios.post(`/manifesTower/generadores/${row._id}/activar`);
            sendMessage(data.message, "Correcto");
            setRefreshKey((value) => value + 1);
        } catch (error) { sendMessage(error.response?.data?.message || "No se pudo activar el generador.", "Error"); }
        finally { setActivando(""); }
    };
    return (
        <><ListPrincipal
            key={refreshKey}
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
            <Column header="Activación" body={(row) => row.estado === "PENDIENTE" ? (
                permissionEdit ? <button type="button" disabled={activando === row._id} onClick={() => activar(row)} className="rounded bg-green-700 px-3 py-1 text-sm text-white disabled:opacity-50">{activando === row._id ? "Activando…" : "Activar"}</button> : <span className="text-sm text-amber-700">Pendiente</span>
            ) : "—"} />
        </ListPrincipal></>
    )
}

export default ListGeneradores;
