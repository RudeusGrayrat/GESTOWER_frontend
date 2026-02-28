import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetailDestino = ({ setShowDetail, selected }) => {
    const {
        razonSocial,
        ruc,
        codigoRegistroEors,
        autorizacionMunicipal,
        tipoManejo,
        direccion,
        correoElectronico,
        telefono,
        representanteLegal,
        responsableTecnico,
        estado,
        createdAt,
        updatedAt,
        ubigeoId
    } = selected;
    return (
        <Details setShowDetail={setShowDetail}>
            <div className="flex flex-wrap justify-around  gap-y-8 gap-x-10 ">
                {/* DATOS DEL DESTINO */}
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold  text-[#026DCC]">DATOS DEL DESTINO FINAL</h3>
                    <PDetail content="RAZÓN SOCIAL: " value={razonSocial} />
                    <PDetail content="RUC: " value={ruc} />
                    <PDetail content="CÓDIGO REGISTRO EO-RS: " value={codigoRegistroEors} />
                    <PDetail content="AUTORIZACIÓN MUNICIPAL: " value={autorizacionMunicipal} />
                    <PDetail content="TIPO DE MANEJO: " value={tipoManejo} />
                    <PDetail content="DIRECCIÓN: " value={direccion} />
                    <PDetail content="CORREO ELECTRÓNICO: " value={correoElectronico} />
                    <PDetail content="TELÉFONO: " value={telefono} />
                    <PDetail content="ESTADO: " value={estado} />
                </div>

                {/* UBICACIÓN */}
                <div className="flex flex-col  gap-8">
                    <div className="flex flex-col ">
                        <h3 className="text-3xl font-bold text-[#026DCC]">UBICACIÓN</h3>
                        <PDetail content="DEPARTAMENTO: " value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " value={ubigeoId?.distrito} />

                    </div>
                    {/* REPRESENTANTE LEGAL */}
                    {representanteLegal && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold  text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " value={representanteLegal.dni} />
                        </div>
                    )}
                </div>

                {/* RESPONSABLE TÉCNICO */}
                <div className="flex flex-col  gap-8">
                    {responsableTecnico && responsableTecnico.nombre && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold  text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                    <div className="flex flex-col">

                        {/* FECHAS */}
                        <h3 className="text-3xl font-bold  text-[#026DCC]">FECHAS</h3>
                        <PDetail content="FECHA DE REGISTRO: " value={new Date(createdAt).toLocaleDateString('es-PE')} />
                        <PDetail content="ÚLTIMA ACTUALIZACIÓN: " value={new Date(updatedAt).toLocaleDateString('es-PE')} />
                    </div>
                </div>
            </div>
        </Details>
    );
};

export default DetailDestino;