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
        createdAt,
        updatedAt
    } = selected;

    return (
        <Details setShowDetail={setShowDetail}>
            <div className="flex flex-wrap justify-around gap-y-8 gap-x-10">
                {/* DATOS DEL GENERADOR */}
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-[#026DCC]">DATOS DEL GENERADOR</h3>
                    <PDetail content="RAZÓN SOCIAL: " value={razonSocial} />
                    <PDetail content="RUC: " value={ruc} />
                    <PDetail content="CORREO ELECTRÓNICO: " value={correoElectronico} />
                    <PDetail content="TELÉFONO: " value={telefono} />
                    <PDetail content="DIRECCIÓN: " value={direccion} />
                    <PDetail content="ESTADO: " value={estado} />
                </div>

                {/* REPRESENTANTE LEGAL */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-bold text-[#026DCC]">REPRESENTANTE LEGAL</h3>
                        <PDetail content="NOMBRE: " value={representanteLegal} />
                        <PDetail content="DNI/CE: " value={dniRepresentante} />
                    </div>
                </div>

                {/* FECHAS */}
                <div className="flex flex-col gap-8">
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

export default DetailGenerador;