import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View"
import useSendMessage from "../../../../recicle/senMessage";
import convertDocx from "../../../../utils/convertDocx";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import axios from "../../../../api/axios";
const { VITE_PLANTILLA_HORAS_EXTRAS } = import.meta.env;
const DetailHorasExtras = ({ setShowDetail, selected }) => {
    const {
        _id
    } = selected;
    const [showDoc, setShowDoc] = useState(true);
    const [docxContent, setDocxContent] = useState("");
    const sendMessage = useSendMessage();
    useEffect(() => {
        if (docxContent) return;
        const renderDocx = async () => {
            try {
                if (!selected) return;
                const plantilla = VITE_PLANTILLA_HORAS_EXTRAS;
                const payload = {
                    logo_empresa: "",
                    nombre_colaborador: selected.colaborador ? selected.colaborador.nombre : "N/A",
                    area_colaborador: selected.colaborador ? selected.colaborador.area : "N/A",
                    fecha_solicitud: selected.fecha,
                    retribucion_pago: selected.retribucionPago,
                    retribucion_compensacion: selected.retribucionCompensacion,
                    forma_compensacion: selected.formaCompensacion,
                    sustento_requerimiento: selected.motivo,
                    colaboradores: [],
                    firma_solicitabte: "",
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