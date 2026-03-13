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
        generadores,
        ubigeoId
    } = selected;
    console.log("Selected Transportista:", selected);
    console.log("generadores:", generadores);
    return (
        <Details setShowDetail={setShowDetail}>
            <div className="flex flex-wrap justify-around gap-y-8 gap-x-10">
                <div className="flex flex-col gap-8">
                    {/* DATOS DEL TRANSPORTISTA */}
                    <div className="flex flex-col gap-2.5">
                        <h3 className="text-3xl font-bold text-[#026DCC]">DATOS DEL TRANSPORTISTA</h3>
                        <PDetail content="RAZÓN SOCIAL: " tamaño={"text-lg !my-0"} value={razonSocial} />
                        <PDetail content="RUC: " tamaño={"text-lg !my-0"} value={ruc} />
                        <PDetail content="REGISTRO EO-RS: " tamaño={"text-lg !my-0"} value={registroEors} />
                        <PDetail content="AUTORIZACIÓN MUNICIPAL: " tamaño={"text-lg !my-0"} value={autorizacionMunicipal} />
                        <PDetail content="DOCUMENTO DE RUTA: " tamaño={"text-lg !my-0"} value={documentoRuta} />
                        <PDetail content="DIRECCIÓN: " tamaño={"text-lg !my-0"} value={direccion} />
                        <PDetail content="CORREO ELECTRÓNICO: " tamaño={"text-lg !my-0"} value={correoElectronico} />
                        <PDetail content="TELÉFONO: " tamaño={"text-lg !my-0"} value={telefono} />
                        <PDetail content="ESTADO: " tamaño={"text-lg !my-0"} value={estado} />
                    </div>
                    {(responsableTecnico && responsableTecnico?.nombre && generadores?.length > 0) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " tamaño={"text-lg !my-0"} value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " tamaño={"text-lg !my-0"} value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                </div>

                {/* UBICACIÓN Y REPRESENTANTE LEGAL */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">CONTINGENCIAS</h3>
                        <PDetail content="DERRAME: " tamaño={"text-lg !my-0"} value={contingencias?.derrame || "No especificado"} />
                        <PDetail content="INFILTRACIÓN: " tamaño={"text-lg !my-0"} value={contingencias?.infiltracion || "No especificado"} />
                        <PDetail content="INCENDIO: " tamaño={"text-lg !my-0"} value={contingencias?.incendio || "No especificado"} />
                        <PDetail content="EXPLOSIÓN: " tamaño={"text-lg !my-0"} value={contingencias?.explosion || "No especificado"} />
                        <PDetail content="OTROS ACCIDENTES: " tamaño={"text-lg !my-0"} value={contingencias?.otros || "No especificado"} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-[#026DCC]">UBICACIÓN</h3>
                        <PDetail content="UBIGEO: " tamaño={"text-lg !my-0"} value={ubigeoId?.codigo} />
                        <PDetail content="DEPARTAMENTO: " tamaño={"text-lg !my-0"} value={ubigeoId?.departamento} />
                        <PDetail content="PROVINCIA: " tamaño={"text-lg !my-0"} value={ubigeoId?.provincia} />
                        <PDetail content="DISTRITO: " tamaño={"text-lg !my-0"} value={ubigeoId?.distrito} />
                    </div>
                    {(representanteLegal && generadores?.length > 0) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " tamaño={"text-lg !my-0"} value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " tamaño={"text-lg !my-0"} value={representanteLegal.dni} />
                        </div>
                    )}

                </div>

                <div className="flex flex-col gap-8">

                    {(generadores?.length === 0 && responsableTecnico) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">RESPONSABLE TÉCNICO</h3>
                            <PDetail content="NOMBRE: " tamaño={"text-lg !my-0"} value={responsableTecnico.nombre} />
                            <PDetail content="N° COLEGIATURA: " tamaño={"text-lg !my-0"} value={responsableTecnico.numeroColegiatura} />
                        </div>
                    )}
                    {(representanteLegal && generadores?.length === 0) && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                            <PDetail content="NOMBRE: " tamaño={"text-lg !my-0"} value={representanteLegal.nombre} />
                            <PDetail content="DNI/CE: " tamaño={"text-lg !my-0"} value={representanteLegal.dni} />
                        </div>
                    )}

                    {generadores && generadores?.length > 0 && (
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-[#026DCC]">GENERADORES ASOCIADOS</h3>
                            {generadores.map((gen, index) => (
                                <div key={index} className="border p-3 rounded-lg">
                                    <PDetail content="RAZÓN SOCIAL: " tamaño={"text-lg !my-0"} value={gen.razonSocial} />
                                    <PDetail content="RUC: " tamaño={"text-lg !my-0"} value={gen.ruc} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Details>
    );
};

export default DetailTransportista;