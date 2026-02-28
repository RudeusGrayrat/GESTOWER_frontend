import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetailPlanta = ({ setShowDetail, selected }) => {
    const {
        denominacion,
        tipoPlanta,
        direccion,
        actividadEconomica,
        sector,
        coordenadasUtm,
        responsableGestion,
        tieneIga,
        institucionApruebaIga,
        fechaAprobacionIga,
        numeroResolucionIga,
        estado,
        createdAt,
        updatedAt,
        generadorId,
        ubigeoId
    } = selected;
console.log(selected);
    return (
        <Details setShowDetail={setShowDetail}>
            <div className="flex flex-wrap justify-around items-start content-start gap-y-8 gap-x-10">
                {/* DATOS DE LA PLANTA */}
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-[#026DCC]">DATOS DE LA PLANTA</h3>
                    <PDetail content="DENOMINACIÓN: " value={denominacion} />
                    <PDetail content="TIPO DE PLANTA: " value={tipoPlanta} />
                    <PDetail content="DIRECCIÓN: " value={direccion} />
                    <PDetail content="ACTIVIDAD ECONÓMICA: " value={actividadEconomica} />
                    <PDetail content="SECTOR: " value={sector} />
                    <PDetail content="ESTADO: " value={estado} />
                </div>

                {/* GENERADOR ASOCIADO Y UBICACIÓN */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">GENERADOR ASOCIADO</h3>
                        <PDetail content="RAZÓN SOCIAL: " value={generadorId?.razonSocial} />
                        <PDetail content="RUC: " value={generadorId?.ruc} />
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">UBICACIÓN</h3>
                        <PDetail content="DEPARTAMENTO: " value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " value={ubigeoId?.distrito} />
                    </div>
                </div>

                {/* COORDENADAS Y RESPONSABLE */}
                <div className="flex flex-col gap-8">
                    {coordenadasUtm && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">COORDENADAS UTM</h3>
                            <PDetail content="NORTE: " value={coordenadasUtm.norte} />
                            <PDetail content="ESTE: " value={coordenadasUtm.este} />
                            <PDetail content="ZONA: " value={coordenadasUtm.zona} />
                        </div>
                    )}

                    {responsableGestion && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE DE GESTIÓN</h3>
                            <PDetail content="NOMBRE: " value={responsableGestion.nombre} />
                            <PDetail content="CARGO: " value={responsableGestion.cargo} />
                            <PDetail content="DNI/CE: " value={responsableGestion.dni} />
                            <PDetail content="CORREO: " value={responsableGestion.correo} />
                            <PDetail content="TELÉFONO: " value={responsableGestion.telefono} />
                        </div>
                    )}
                </div>

                {/* IGA Y FECHAS */}
                <div className="flex flex-col gap-8">
                    {tieneIga && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">INSTRUMENTO DE GESTIÓN AMBIENTAL</h3>
                            <PDetail content="INSTITUCIÓN: " value={institucionApruebaIga} />
                            <PDetail content="FECHA DE APROBACIÓN: " value={fechaAprobacionIga} />
                            <PDetail content="N° DE RESOLUCIÓN: " value={numeroResolucionIga} />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">FECHAS</h3>
                        <PDetail content="FECHA DE REGISTRO: " value={new Date(createdAt).toLocaleDateString('es-PE')} />
                        <PDetail content="ÚLTIMA ACTUALIZACIÓN: " value={new Date(updatedAt).toLocaleDateString('es-PE')} />
                    </div>
                </div>
            </div>
        </Details>
    );
};

export default DetailPlanta;