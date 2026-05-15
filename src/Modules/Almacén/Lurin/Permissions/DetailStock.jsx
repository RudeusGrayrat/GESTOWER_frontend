import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetaiStock = ({ setShowDetail, selected }) => {
    const {
        numeroDeActa,
        correlativaActa,
        descripcion,
        pesoNeto,
        pesoBruto,
        contrato,
        detallesBien,
        cantidadTotal,
        cantidadDisponible,
        estado,
        unidadDeMedida,
        historial,
    } = selected || {};
    return (
        <Details setShowDetail={setShowDetail} >
            <div className="px-6 py-4 bg-white rounded-xl">
                <h2 className="text-2xl text-sky-700 font-bold mb-4 border-b pb-2">Detalles del Stock</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <PDetail content="Número de Acta:" value={numeroDeActa} />
                    <PDetail content="Correlativa:" value={correlativaActa} />
                    <PDetail content="Contrato / Cliente:" value={contrato} />
                    <PDetail content="Descripción:" value={descripcion} />
                    <PDetail content="Stock Total Ingresado:" value={cantidadTotal} />
                    <PDetail content="Stock sin ubicar:" value={cantidadDisponible} />
                    <PDetail content="Peso Neto:" value={pesoNeto ? pesoNeto + " kg" : "N/A"} />
                    <PDetail content="Peso Bruto:" value={pesoBruto ? pesoBruto + " kg" : "N/A"} />
                    <PDetail content="Unidad de Medida:" value={unidadDeMedida} />
                    <PDetail content="Estado:" value={estado} />
                </div>

                <div className="mt-5">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
                        Historial
                    </h3>
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-2 text-sm font-semibold">Fecha</th>
                                    <th className="p-2 text-sm font-semibold">Ubicación</th>
                                    <th className="p-2 text-sm font-semibold">Acción</th>
                                    <th className="p-2 text-sm font-semibold">Modificado Por</th>
                                    <th className="p-2 text-sm font-semibold">Cantidad</th>
                                    <th className="p-2 text-sm font-semibold">Cant. Libre</th>
                                    <th className="p-2 text-sm font-semibold">Cant. Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.historial && selected.historial?.length > 0 ? (
                                    selected.historial.map((h, index) => (
                                        <tr key={index} className="border-t hover:bg-slate-50">
                                            <td className="p-2 text-sm">
                                                {new Date(h.fecha).toLocaleString()}
                                            </td>
                                            <td className="p-2 text-sm font-medium text-sky-700">
                                                {h.ubicacion || "Sin ubicar"}
                                            </td>
                                            <td className="p-2 text-sm">
                                                {h.accion}
                                            </td>
                                            <td className="p-2 text-sm">
                                                {h.actualizadoPor.name + " " + h.actualizadoPor.lastname}
                                            </td>
                                            <td className="p-2 text-sm font-bold">
                                                {h.cantidadIngresada}
                                            </td>
                                            <td className="p-2 text-sm font-bold">
                                                {h.cantidadDisponible}
                                            </td>
                                            <td className="p-2 text-sm font-bold">
                                                {h.cantidadTotal}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-center text-gray-500 italic">
                                            Sin movimientos registrados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Details>
    );
}

export default DetaiStock;