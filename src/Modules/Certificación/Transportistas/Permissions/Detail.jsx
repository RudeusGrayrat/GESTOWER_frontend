import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

const DetailTransportista = ({ setShowDetail, selected }) => {
    const {
        razonSocial,
        ruc,
        registroEors,
        autorizacionMunicipal,
        documentoRuta,
        direccion,
        correoElectronico,
        telefono,
        representanteLegal,
        responsableTecnico,
        estado,
        contingencias,
        ubigeoId
    } = selected;

    return (
        <Details setShowDetail={setShowDetail}>
            <div className="flex flex-wrap justify-around gap-y-8 gap-x-10">
                {/* DATOS DEL TRANSPORTISTA */}
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-[#026DCC]">DATOS DEL TRANSPORTISTA</h3>
                    <PDetail content="RAZÓN SOCIAL: " value={razonSocial} />
                    <PDetail content="RUC: " value={ruc} />
                    <PDetail content="REGISTRO EO-RS: " value={registroEors} />
                    <PDetail content="AUTORIZACIÓN MUNICIPAL: " value={autorizacionMunicipal} />
                    <PDetail content="DOCUMENTO DE RUTA: " value={documentoRuta} />
                    <PDetail content="DIRECCIÓN: " value={direccion} />
                    <PDetail content="CORREO ELECTRÓNICO: " value={correoElectronico} />
                    <PDetail content="TELÉFONO: " value={telefono} />
                    <PDetail content="ESTADO: " value={estado} />
                </div>

                {/* UBICACIÓN Y REPRESENTANTE LEGAL */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">CONTINGENCIAS</h3>
                        <PDetail content="DERRAME: " value={contingencias?.derrame || "No especificado"} />
                        <PDetail content="INFILTRACIÓN: " value={contingencias?.infiltracion || "No especificado"} />
                        <PDetail content="INCENDIO: " value={contingencias?.incendio || "No especificado"} />
                        <PDetail content="EXPLOSIÓN: " value={contingencias?.explosion || "No especificado"} />
                        <PDetail content="OTROS ACCIDENTES: " value={contingencias?.otros || "No especificado"} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">UBICACIÓN</h3>
                        <PDetail content="UBIGEO: " value={ubigeoId?.codigo} />
                        <PDetail content="DEPARTAMENTO: " value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " value={ubigeoId?.distrito} />
                    </div>


                </div>

                {/* RESPONSABLE TÉCNICO Y FECHAS */}
                <div className="flex flex-col gap-8">
                    {representanteLegal && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " value={representanteLegal.dni} />
                        </div>
                    )}
                    {responsableTecnico && responsableTecnico.nombre && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}

                </div>
            </div>
        </Details>
    );
};

export default DetailTransportista;