import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetailGenerador = ({ setShowDetail, selected }) => {
    const {
        razonSocial,
        ruc,
        correoElectronico,
        direccion,
        telefono,
        representanteLegal,
        dniRepresentante,
        estado,

        plantas,
        responsablesTecnicos,

        createdAt,
        updatedAt
    } = selected;
    console.log("Selected para detalle:", selected);
    return (
        <Details setShowDetail={setShowDetail} estilos={"!p-5"}>
            <div className=" w-full h-full justify-center  gap-x-5 grid grid-cols-3">
                {/* DATOS DEL GENERADOR */}
                <div className="flex flex-col gap-1 border-gray-200 border rounded-lg p-4 shadow-sm">
                    <span className="text-3xl mb-2 font-bold text-[#026DCC]">DATOS DEL GENERADOR</span>
                    <PDetail content="Razón Social: " value={razonSocial} />
                    <PDetail content="RUC: " value={ruc} />
                    <PDetail content="Correo Electrónico: " value={correoElectronico} />
                    <PDetail content="Teléfono: " value={telefono} />
                    <PDetail content="Dirección: " value={direccion} />
                    <PDetail content="Nombre de Representante: " value={representanteLegal} />
                    <PDetail content="DNI/CE de Representante: " value={dniRepresentante} />
                    <p className="text-xl text-gray-700 my-0">
                        <strong className="text-gray-700 mr-2">Estado: </strong>
                        <span className={`${estado === "ACTIVO" ? "text-green-600" : "text-red-600"} font-semibold`}>
                            {estado}
                        </span>
                    </p>
                </div>
                {/* REPRESENTANTE LEGAL */}
                <div className="flex flex-col gap-1 border-gray-200 border rounded-lg p-4 shadow-sm">
                    <span className="text-3xl font-bold mb-2 text-[#026DCC]">DATOS DE PLANTA</span>
                    {/* platas al ser un array se deb hacer un mapeo para reenderizar los multiples datos de planta */}
                    {plantas && plantas.length > 0 ? (
                        plantas.map((planta, index) => (
                            <div key={index} className={`mb-4  pb-3 ${plantas.length > 1 ? " border-b border-gray-300" : ""}`}>
                                <PDetail content="Denominación: " value={planta.denominacion} />
                                <PDetail content="Tipo de Planta: " value={planta.tipoPlanta} />
                                <PDetail content="Dirección: " value={planta.direccion} />
                                <PDetail content="Ubigeo: " value={planta.ubigeoId.codigo} />
                                <PDetail content="Actividad Económica: " value={planta.actividadEconomica} />
                                <PDetail content="Sector" value={planta.sector} />
                                <PDetail content="Coordenadas Utm: " value={`Norte: ${planta.coordenadasUtm.norte}, Este: ${planta.coordenadasUtm.este}, Zona: ${planta.coordenadasUtm.zona}`} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay plantas registradas.</p>
                    )}
                </div>
                {/* FECHAS */}
                <div className="flex flex-col gap-1 border-gray-200 border rounded-lg p-4 shadow-sm">
                    <span className="text-3xl mb-2 font-bold text-[#026DCC]">DATOS DE RESPONSABLE</span>
                    {responsablesTecnicos && responsablesTecnicos.length > 0 ? (
                        responsablesTecnicos.map((responsable, index) => (
                            <div key={index} className={`mb-4  pb-3 ${responsablesTecnicos.length > 1 ? " border-b border-gray-300" : ""}`}>
                                <PDetail content="Nombre: " value={responsable.nombreResponsable} />
                                <PDetail content="DNI: " value={responsable.dniResponsable} />
                                <PDetail content="Cargo: " value={responsable.cargoResponsable} />
                                <PDetail content="Correo: " value={responsable.correoResponsable} />
                                <PDetail content="Teléfono: " value={responsable.telefonoResponsable} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay responsables técnicos registrados.</p>
                    )}
                </div>
            </div>
        </Details>
    );
};

export default DetailGenerador;