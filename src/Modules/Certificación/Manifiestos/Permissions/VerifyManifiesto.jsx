import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext"; // 🌟 Recuperamos tu hook de auth
import useSendMessage from "../../../../recicle/senMessage";

const VerificarManifiesto = ({ setShowVerify, selected, reload }) => {
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useAuth(); // 🌟 Obtenemos el usuario logueado
    const sendMessage = useSendMessage();

    const handleDecision = async (nuevoEstado) => {
        if ((nuevoEstado === "OBSERVADO" || nuevoEstado === "RECHAZADO") && !comentario.trim()) {
            sendMessage("El comentario es obligatorio para observar o rechazar.", "Advertencia");
            return;
        }

        setLoading(true);
        try {
            // 🌟 Centralizamos el envío de datos incluyendo quién ejecuta la acción
            const response = await axios.patch(`/certificaciones/verificarManifiesto/${selected._id}`, {
                estado: nuevoEstado,
                observaciones: comentario,
                usuarioId: user?._id // Enviamos el ID del operador/asistente
            });

            // Sincronizado con tu formato: response.data.message y response.data.type
            sendMessage(response.data.message, response.data.type || "Correcto");
            reload();
            setShowVerify(false);
        } catch (error) {
            console.error("Error en verificación:", error);
            sendMessage(error.response?.data?.message || "Error al procesar la verificación", "Error");
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "PENDIENTE": return "text-yellow-500";
            case "RECHAZADO": return "text-red-500";
            case "APROBADO": return "text-green-500";
            case "OBSERVADO": return "text-orange-500";
            case "ENVIADO": return "text-blue-500";
            case "EN REVISION": return "text-purple-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="w-screen h-screen fixed top-0 right-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-3xl bg-gradient-to-tr from-[#f9fafb] to-[#f3f4f6] rounded-xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">

                <button
                    onClick={() => setShowVerify(false)}
                    className="absolute top-2 right-2 h-12 w-12 text-white rounded-full bg-gradient-to-tr from-[#2b5993] to-[#418fda] shadow-lg hover:scale-95 active:scale-90 transition-all flex items-center justify-center z-50 focus:outline-none"
                >
                    <span className="pi pi-times text-2xl font-bold"></span>
                </button>

                <div className="p-6 border-b border-gray-200/60 bg-white/60">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#2b5993] to-[#418fda] bg-clip-text text-transparent flex items-center gap-2">
                        <span className="pi pi-shield text-2xl text-[#4378b9]"></span>
                        Evaluación y Verificación de Manifiesto
                    </h3>
                    <p className="text-md text-gray-400 mt-1">N° Documento: {selected?.numeroManifiesto}</p>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 p-5 rounded-xl border border-gray-100 shadow-inner text--lg">
                        <div className="text-gray-700">
                            <strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Generador:</strong>
                            <span className="font-medium text-gray-800">{selected?.generadorId?.razonSocial || 'N/A'}</span>
                        </div>
                        <div className="text-gray-700">
                            <strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Transportista:</strong>
                            <span className="font-medium text-gray-800">{selected?.transportistaId?.razonSocial || 'N/A'}</span>
                        </div>
                        <div className="text-gray-700 ">
                            <strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Residuo:</strong>
                            <span className="font-medium text-gray-800">{selected?.residuo?.descripcion || 'N/A'}</span>
                        </div>
                        <div className="text-gray-700">
                            <span className="text-md text-gray-400 font-semibold uppercase">Estado Actual:</span>
                            <div className={` font-medium  ${getEstadoColor(selected?.estado)}`}>
                                {selected?.estado}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700 flex items-center gap-1.5 text-md">
                            <span className="pi pi-comment text-gray-400"></span>
                            Comentarios / Observaciones de Revisión:
                        </label>
                        <InputTextarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            rows={4}
                            placeholder="Especifica detalladamente los motivos del rechazo, las observaciones técnicas que deben subsanarse o notas aclaratorias de aprobación..."
                            className="p-3 border border-gray-200 focus:border-blue-400 focus:shadow-md rounded-xl w-full bg-white transition-all resize-none shadow-inner text--lg outline-none"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200/60 bg-white/60 flex flex-wrap justify-around gap-3">
                    <button
                        disabled={loading}
                        onClick={() => handleDecision("RECHAZADO")}
                        className="bg-gradient-to-tr from-rose-500 to-red-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                    >
                        {loading ? <span className="pi pi-spin pi-spinner mr-2"></span> : <span className="pi pi-times-circle mr-2"></span>}
                        Rechazar por Completo
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handleDecision("OBSERVADO")}
                        className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                    >
                        {loading ? <span className="pi pi-spin pi-spinner mr-2"></span> : <span className="pi pi-exclamation-triangle mr-2"></span>}
                        Observar Manifiesto
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handleDecision("APROBADO")}
                        className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                    >
                        {loading ? <span className="pi pi-spin pi-spinner mr-2"></span> : <span className="pi pi-check-circle mr-2"></span>}
                        Aprobar y Firmar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VerificarManifiesto;