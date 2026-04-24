import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetaiStock = ({ setShowDetail, selected, reload }) => {
    const id = selected._id;

    const update = async () => {
        // Aquí puedes hacer la llamada a la API para obtener los detalles del manifiesto usando el ID
        // Por ejemplo:
        // const response = await axios.get(`/certificaciones/getManifiestoById/${id}`);
        // const data = response.data;
        // Luego puedes pasar 'data' a tu componente de detalles para mostrar la información
    }
    return (
        <Details setShowDetail={setShowDetail} update={update}>
            <div className="p-4 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl text-sky-700 font-bold mb-4">Detalles del Stock</h2>
                <div className=" flex gap-x-4 flex-wrap">
                    <PDetail content="Número de Acta:" value={selected.movimientoId?.numeroDeActa} />
                    <PDetail content="Contrato:" value={selected.contratoId?.cliente} />
                    <PDetail content="Descripción del Bien:" value={selected.productoId?.descripcion} />
                    <PDetail content="Cantidad:" value={selected.cantidadTotal} />
                    <PDetail content="Unidad de Medida:" value={selected.productoId?.unidadDeMedida} />
                    {true && (
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mt-2">Movimientos del Producto:</h3>
                            <ul className="list-disc list-inside">
                                {selected.productoId?.movimientos?.map((movimiento, index) => (
                                    <li key={index}>
                                        <span className="font-medium">Tipo:</span> {movimiento?.tipo} -
                                        <span className="font-medium"> Cantidad:</span> {movimiento?.cantidad} -
                                        <span className="font-medium"> Fecha:</span> {new Date(movimiento?.fecha).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                    }
                </div>
            </div>
        </Details>
    );
}

export default DetaiStock;