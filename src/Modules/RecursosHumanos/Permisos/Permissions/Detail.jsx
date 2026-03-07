import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetailPermisos = ({ setShowDetail, selected }) => {
    const {
        fechaInicio,
        fechaFin,
        colaborador,
        duracionHoras,
        estado,
        creadoPor,
        aprobadoPor,
    } = selected || {};
    console.log("Selected data in DetailPermisos:", selected);
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Permiso" >
            <div className="flex flex-col">
                <h3 className="text-3xl font-bold mb-4 text-[#026DCC]">DETALLE DE PERMISO</h3>
                <PDetail content="FECHA INICIO: " value={fechaInicio} />
                <PDetail content="FECHA FIN: " value={fechaFin} />
                <PDetail content="COLABORADOR: " value={`${colaborador?.name} ${colaborador?.lastname}`} />
                <PDetail content="DURACIÓN EN HORAS: " value={duracionHoras || ""} />
                <PDetail content="CREADO POR: " value={creadoPor ? `${creadoPor?.name} ${creadoPor?.lastname}` : ""} />
                <PDetail content="APROBADO POR: " value={aprobadoPor ? `${aprobadoPor?.name} ${aprobadoPor?.lastname}` : ""} />
                <PDetail content="ESTADO: " value={estado} />
            </div>
        </Details>
    )
}

export default DetailPermisos
