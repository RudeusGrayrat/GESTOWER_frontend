import Details from "../../../../components/Principal/Permissions/View"
import PDetail from "../../../../recicle/PDtail"

const DetailHorasExtras = ({ setShowDetail, selected }) => {
    const {
        fecha,
        colaborador,
        horas,
        minutos,
        minutosTotales,
        estado,
        creadoPor,
        aprobadoPor,
    } = selected || {};
    console.log("Selected data in DetailHorasExtras:", selected);
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Horas Extras" >
            <div className="flex flex-col">
                <h3 className="text-3xl font-bold mb-4 text-[#026DCC]">DETALLE DE HORAS EXTRAS</h3>
                <PDetail content="FECHA: " value={fecha} />
                <PDetail content="COLABORADOR: " value={`${colaborador?.name} ${colaborador?.lastname}`} />
                <PDetail content="HORAS: " value={horas || ""} />
                <PDetail content="MINUTOS: " value={minutos || ""} />
                <PDetail content="MINUTOS TOTALES: " value={minutosTotales} />
                <PDetail content="CREADO POR: " value={creadoPor ? `${creadoPor?.name} ${creadoPor?.lastname}` : ""} />
                <PDetail content="APROBADO POR: " value={aprobadoPor ? `${aprobadoPor?.name} ${aprobadoPor?.lastname}` : ""} />
                <PDetail content="ESTADO: " value={estado} />
            </div>
        </Details>
    )
}

export default DetailHorasExtras