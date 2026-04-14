import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import convertDocx from "../../../../utils/convertDocx";
import { saveAs } from "file-saver"; // npm install file-saver

const DetailHorasExtras = ({ setShowDetail, selected }) => {
    const [loading, setLoading] = useState(true);
    const [fileGenerated, setFileGenerated] = useState(null);
    const [fileName, setFileName] = useState("");
    const sendMessage = useSendMessage();

    useEffect(() => {
        // Reset estados al cambiar de fila seleccionada
        setLoading(true);
        setFileGenerated(null);

        const prepareFile = async () => {
            try {
                if (!selected) return;
                const listColaboradores = selected.colaboradores.map((colab) => {
                    const colaboradorData = colab.colaborador || {};
                    const nombre = colaboradorData.name && colaboradorData.lastname ? `${colaboradorData.lastname}, ${colaboradorData.name}` : "";
                    return {
                        nombre: nombre,
                        cargo: colaboradorData?.charge || "",
                        hora_inicio: colab?.horaInicio || "",
                        hora_fin: colab?.horaFin || "",
                        total_horas: `${colab?.horas || 0}h ${colab?.minutos || 0}m`,
                    };
                });
                const check = (value) => value ? "X" : "";
                // 1. Lógica de negocio para el Logo
                const bSolicitante = selected.solicitante?.business || "";
                // DEFINIMOS bUpper AQUÍ:
                const bUpper = bSolicitante.toUpperCase();

                let logoEmpresa = "/TOWER_LOGO.png"; // Default

                // Ahora ya puedes usar bUpper sin errores
                if (bUpper.includes("CORPEMSE")) {
                    logoEmpresa = "/CORPEMSE_LOGO.png";
                } else if (bUpper.includes("LURIN")) {
                    logoEmpresa = "/INVERSIONES_LURIN_LOGO.png";
                } else if (bUpper.includes("ECOLOGY")) {
                    logoEmpresa = "/ECOLOGY_LOGO.png";
                } else if (bUpper.includes("LABORATORIO")) {
                    logoEmpresa = "/LADIAMB_LOGO.png";
                }

                const payload = {
                    logo_empresa: logoEmpresa,
                    nombre_colaborador: selected.solicitante ? `${selected.solicitante.lastname}, ${selected.solicitante.name}` : "",
                    area_colaborador: selected.solicitante?.area ? selected.solicitante?.area : "",
                    fecha_solicitud: selected.fecha || "",
                    retribucion_pago: check(selected.retribucion === "PAGO"),
                    retribucion_compensacion: check(selected.retribucion === "COMPENSACION"),
                    foma_compensacion: selected.formaCompensacion || "",
                    sustento_requerimiento: selected.motivo || "",
                    colaboradores: listColaboradores,
                    // firma_solicitante: "",
                    // firma_jefe_inmediato: "",
                    // fecha_recepcion_rrhh: "",
                }

                // 2. Generar el archivo en memoria (sin subirlo a ningún lado)
                const nombreArchivo = `${selected.correlativo || 'HE'}_${selected.fecha.replace(/\//g, "-")}`;
                const file = await convertDocx(payload, import.meta.env.VITE_PLANTILLA_HORAS_EXTRAS, nombreArchivo);

                setFileGenerated(file);
                setFileName(nombreArchivo);
                setLoading(false);
            } catch (error) {
                console.error(error);
                sendMessage("Error al preparar el documento", "Error");
                setLoading(false);
            }
        };

        prepareFile();
    }, [selected]);

    const handleDownload = () => {
        if (fileGenerated) {
            saveAs(fileGenerated, `${fileName}.docx`);
        }
    };

    const handlePreview = () => {
        if (fileGenerated) {
            const fileURL = URL.createObjectURL(fileGenerated);
            window.open(fileURL, '_blank');
            // Nota: El navegador descargará el Word o lo abrirá si tiene extensión de Office.
        }
    };

    return (
        <Details setShowDetail={setShowDetail} title="Detalle de Horas Extras">
            {!loading && fileGenerated ? (
                <div className="flex gap-8 mt-6 ml-10">
                    {/* BOTÓN VISUALIZAR / ABRIR */}
                    <div
                        onClick={handleDownload}
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
                    >
                        <span>Descargar Word</span>
                        <span className="ml-2 pi pi-eye"></span>
                    </div>

                    {/* BOTÓN DESCARGAR PDF */}
                    <div
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
                        onClick={() => {
                            sendMessage("Funcionalidad de descarga PDF en desarrollo", "Info");
                            // Aquí podrías implementar la lógica para convertir el Word a PDF o descargar el Word directamente, dependiendo de tus necesidades.
                            // Por ejemplo, podrías usar una librería como docx-pdf para convertir el .docx a .pdf en el frontend, o simplemente descargar el .docx generado.
                            // handleDownload(); // Si decides descargar el Word directamente
                        }}
                    >
                        Descargar PDF <span className="ml-2 pi pi-download"></span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center mt-10">
                    <span className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></span>
                    <p className="text-gray-500 animate-pulse">Generando documento ...</p>
                </div>
            )}
        </Details>
    );
};
export default DetailHorasExtras;