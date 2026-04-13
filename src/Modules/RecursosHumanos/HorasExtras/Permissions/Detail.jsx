import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View"
import useSendMessage from "../../../../recicle/senMessage";
import convertDocx from "../../../../utils/convertDocx";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import axios from "../../../../api/axios";
const { VITE_PLANTILLA_HORAS_EXTRAS } = import.meta.env;
const DetailHorasExtras = ({ setShowDetail, selected }) => {
    console.log("Selected data for detail view:", selected);
    const [showDoc, setShowDoc] = useState(false);
    const [docxContent, setDocxContent] = useState("");
    const sendMessage = useSendMessage();
    const safe = (value) => {
        if (value === undefined || value === null) return "";
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value ? 'X' : '';
        return String(value);
    };
    const check = (condition) => condition ? 'X' : '';

    useEffect(() => {
        if (docxContent) return;
        const renderDocx = async () => {
            try {
                if (!selected) return;
                const plantilla = VITE_PLANTILLA_HORAS_EXTRAS;
                const listColaboradores = selected.colaboradores.map((colab) => {
                    const colaboradorData = colab.colaborador || {};
                    const nombre = colaboradorData.name && colaboradorData.lastname ? `${colaboradorData.lastname}, ${colaboradorData.name}` : "";
                    return {
                        nombre: nombre,
                        cargo: colaboradorData?.cargo || "",
                        hora_inicio: colab?.horaInicio || "",
                        hora_fin: colab?.horaFin || "",
                        total_horas: colab?.horas || "",
                    };
                });
                const payload = {
                    logo_empresa: "",
                    nombre_colaborador: selected.solicitante ? `${selected.solicitante.lastname}, ${selected.solicitante.name}` : "",
                    area_colaborador: selected.solicitante ? selected.solicitante.area : "",
                    fecha_solicitud: selected.fecha || "",
                    retribucion_pago: selected.retribucionPago || "",
                    retribucion_compensacion: selected.retribucionCompensacion || "",
                    foma_compensacion: selected.formaCompensacion || "",
                    sustento_requerimiento: selected.motivo || "",
                    colaboradores: listColaboradores,
                    firma_solicitante: "",
                    firma_jefe_inmediato: "",
                    fecha_recepcion_rrhh: "",
                }
                const file = await convertDocx(payload, plantilla, "");
                if (!file) {
                    sendMessage("Error al cargar el archivo", "Error");
                    return;
                }
                const fechaConGuion = selected.fecha.replace(/\//g, "-");
                const correlativa = selected.correlativo ? `_${selected.correlativo}` : "horas_extras";
                const pathCloudinary = await documentoCloudinary(
                    file,
                    `${correlativa}_${fechaConGuion}`
                );
                setDocxContent(pathCloudinary.secure_url);
                setShowDoc(true);
                await axios.delete("/deleteDocument", {
                    data: { public_id: pathCloudinary.public_id },
                });
                return
            } catch (error) {
                sendMessage(error, "Error");
            }
        };
        renderDocx();
    }, [selected]);
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        docxContent
    )}`;
    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Horas Extras" >
            {showDoc ? (
                <div className="flex gap-8 mt-6 ml-10">
                    <a href={officeViewerUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer">
                        <span>
                            Visualizar Word
                        </span>
                        <span className="ml-2 pi pi-eye"></span>
                    </a>
                    <div
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer"
                        onClick={() => setShowDetail(false)}>
                        Descargar <span className="ml-2 pi pi-download"></span>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </Details>
    )
}

export default DetailHorasExtras