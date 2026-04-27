import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetaiStock = ({ setShowDetail, selected }) => {
    // Nota: 'selected' viene con el mapeo que hicimos en getStockAlmacen
    return (
        <Details setShowDetail={setShowDetail} >
            <div className="p-6 bg-white rounded-xl">
                <h2 className="text-2xl text-sky-700 font-bold mb-6 border-b pb-2">Detalles del Stock</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <PDetail content="Número de Acta:" value={selected.numeroDeActa} />
                    <PDetail content="Correlativa:" value={selected.correlativa} />
                    <PDetail content="Contrato / Cliente:" value={selected.contrato} />
                    <PDetail content="Descripción:" value={selected.detallesBien?.descripcion} />
                    <PDetail content="Stock Total Ingresado:" value={selected.cantidadTotal} />
                    <PDetail content="Stock Disponible Actual:" value={selected.cantidadDisponible} />
                    <PDetail content="Unidad de Medida:" value={selected.detallesBien?.unidad} />
                    <PDetail content="Estado:" value={selected.estado} />
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
                        Historial de Movimientos Internos
                    </h3>
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 text-sm font-semibold">Fecha</th>
                                    <th className="p-3 text-sm font-semibold">Ubicación / Acción</th>
                                    <th className="p-3 text-sm font-semibold">Cant. Libre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.historial && selected.historial.length > 0 ? (
                                    selected.historial.map((h, index) => (
                                        <tr key={index} className="border-t hover:bg-slate-50">
                                            <td className="p-3 text-sm">
                                                {new Date(h.fecha).toLocaleString()}
                                            </td>
                                            <td className="p-3 text-sm font-medium text-sky-700">
                                                {h.ubicacion}
                                            </td>
                                            <td className="p-3 text-sm font-bold">
                                                {h.cantidadDisponible}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-500 italic">
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