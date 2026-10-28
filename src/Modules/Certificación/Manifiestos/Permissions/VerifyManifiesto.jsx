import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "../../../../api/axios";
import { useAuth } from "../../../../context/AuthContext"; // 🌟 Recuperamos tu hook de auth
import useSendMessage from "../../../../recicle/senMessage";

const VerificarManifiesto = ({ setShowVerify, selected, reload }) => {
    const [comentario, setComentario] = useState("");
    const [destinoFinal, setDestinoFinal] = useState({ tipoManejo: "", cantidadEntregada: "", observaciones: "" });
    const [loading, setLoading] = useState(false);

    const { user } = useAuth(); // 🌟 Obtenemos el usuario logueado
    const sendMessage = useSendMessage();
    const pendienteGenerador = selected?.estado === "PENDIENTE";
    const puedeEvaluarDestino = ["ENVIADO", "EN REVISION"].includes(selected?.estado);
    const puedeObservar = pendienteGenerador || puedeEvaluarDestino;

    const handleDecision = async (nuevoEstado) => {
        if (nuevoEstado === "OBSERVADO" ? !puedeObservar : !puedeEvaluarDestino) {
            sendMessage("Esta acción no está disponible para el estado actual del manifiesto.", "Advertencia");
            return;
        }
        if ((nuevoEstado === "OBSERVADO" || nuevoEstado === "RECHAZADO") && !comentario.trim()) {
            sendMessage("El comentario es obligatorio para observar o rechazar.", "Advertencia");
            return;
        }
        if (nuevoEstado === "APROBADO" && (!destinoFinal.tipoManejo || destinoFinal.cantidadEntregada === "" || Number(destinoFinal.cantidadEntregada) < 0)) {
            sendMessage("Completa el tipo de manejo y la cantidad entregada por el destino.", "Advertencia");
            return;
        }

        setLoading(true);
        try {
            // 🌟 Centralizamos el envío de datos incluyendo quién ejecuta la acción
            const response = await axios.patch(`/certificaciones/verificarManifiesto/${selected._id}`, {
                estado: nuevoEstado,
                observaciones: comentario,
                destinoFinal,
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
                    {puedeEvaluarDestino && (
                        <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
                            <div><h4 className="font-semibold text-blue-950">Destino final — Tower</h4><p className="text-sm text-blue-800">Esta información la completa Tower al aprobar; no la ingresa el generador ni el transportista.</p></div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <label className="text-sm font-medium text-slate-700">Tipo de manejo<select value={destinoFinal.tipoManejo} onChange={(event) => setDestinoFinal((prev) => ({ ...prev, tipoManejo: event.target.value }))} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2"><option value="">Seleccionar</option><option value="TRATAMIENTO">Tratamiento</option><option value="DISPOSICIÓN FINAL">Disposición final</option><option value="VALORIZACIÓN">Valorización</option></select></label>
                                <label className="text-sm font-medium text-slate-700">Cantidad entregada (toneladas)<input type="number" min="0" step="0.01" value={destinoFinal.cantidadEntregada} onChange={(event) => setDestinoFinal((prev) => ({ ...prev, cantidadEntregada: event.target.value }))} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" /></label>
                            </div>
                            <label className="block text-sm font-medium text-slate-700">Observaciones del destino<textarea value={destinoFinal.observaciones} onChange={(event) => setDestinoFinal((prev) => ({ ...prev, observaciones: event.target.value }))} rows={3} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" /></label>
                        </section>
                    )}

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

                    {pendienteGenerador && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            Pendiente de revisión del generador. Puedes observarlo para su corrección; para aprobarlo o rechazarlo, el generador debe aprobarlo y enviarlo al destino.
                        </div>
                    )}
                    {!pendienteGenerador && !puedeEvaluarDestino && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                            Este manifiesto no está disponible para revisión en su estado actual.
                        </div>
                    )}
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
                        disabled={loading || !puedeEvaluarDestino}
                        onClick={() => handleDecision("RECHAZADO")}
                        className="bg-gradient-to-tr from-rose-500 to-red-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                    >
                        {loading ? <span className="pi pi-spin pi-spinner mr-2"></span> : <span className="pi pi-times-circle mr-2"></span>}
                        Rechazar por Completo
                    </button>

                    <button
                        disabled={loading || !puedeObservar}
                        onClick={() => handleDecision("OBSERVADO")}
                        className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md flex justify-center items-center cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                    >
                        {loading ? <span className="pi pi-spin pi-spinner mr-2"></span> : <span className="pi pi-exclamation-triangle mr-2"></span>}
                        Observar Manifiesto
                    </button>

                    <button
                        disabled={loading || !puedeEvaluarDestino}
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
