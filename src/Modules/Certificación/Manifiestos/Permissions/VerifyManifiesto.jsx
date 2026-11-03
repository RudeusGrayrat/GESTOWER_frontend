import React, { useEffect, useMemo, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const otrosVacios = {
    razonSocialReceptor: "", rucReceptor: "", correoReceptor: "", telefonoReceptor: "",
    comercializacion: false, exportacion: false, otro: false, tipoManejo: "", direccionDestino: "", documentoAprueba: "",
};

const VerificarManifiesto = ({ setShowVerify, selected, reload }) => {
    const [comentario, setComentario] = useState("");
    const [destinoFinal, setDestinoFinal] = useState({ tipoManejo: "", cantidadEntregada: "", observaciones: "" });
    const [otrosManejos, setOtrosManejos] = useState(otrosVacios);
    const [responsableDestinoId, setResponsableDestinoId] = useState("");
    const [mostrarCierreDestino, setMostrarCierreDestino] = useState(false);
    const [loading, setLoading] = useState(false);
    const sendMessage = useSendMessage();

    // PENDIENTE queda admitido únicamente para documentos del flujo anterior.
    // El flujo vigente no exige aprobación previa del generador.
    const puedeEvaluarDestino = ["ENVIADO", "EN REVISION", "PENDIENTE"].includes(selected?.estado);
    const puedeObservar = puedeEvaluarDestino;
    const destino = selected?.destinoId && typeof selected.destinoId === "object" ? selected.destinoId : null;
    const responsablesConFirma = useMemo(
        () => (destino?.responsables || []).filter((responsable) => typeof responsable.firmaResponsable === "string" && responsable.firmaResponsable.trim()),
        [destino]
    );

    useEffect(() => {
        if (!responsableDestinoId && responsablesConFirma[0]?._id) setResponsableDestinoId(String(responsablesConFirma[0]._id));
    }, [responsableDestinoId, responsablesConFirma]);

    const actualizarDestino = (campo, valor) => setDestinoFinal((prev) => ({ ...prev, [campo]: valor }));
    const actualizarOtros = (campo, valor) => setOtrosManejos((prev) => ({ ...prev, [campo]: valor }));
    const alternarOtroManejo = (campo) => {
        setOtrosManejos((prev) => {
            if (prev[campo]) return otrosVacios;
            const desdeDestino = campo === "comercializacion" && destino ? {
                razonSocialReceptor: destino.razonSocial || "", rucReceptor: destino.ruc || "",
                correoReceptor: destino.correoElectronico || "", telefonoReceptor: destino.telefono || "",
                direccionDestino: destino.direccion || "", documentoAprueba: destino.codigoRegistroEors || "",
            } : {};
            return { ...otrosVacios, ...desdeDestino, [campo]: true };
        });
    };

    const handleDecision = async (nuevoEstado) => {
        if (nuevoEstado === "OBSERVADO" ? !puedeObservar : !puedeEvaluarDestino) {
            sendMessage("Esta acción no está disponible para el estado actual del manifiesto.", "Advertencia");
            return;
        }
        if ((nuevoEstado === "OBSERVADO" || nuevoEstado === "RECHAZADO") && !comentario.trim()) {
            sendMessage("El comentario es obligatorio para observar o rechazar.", "Advertencia");
            return;
        }
        if (nuevoEstado === "APROBADO") {
            if (!mostrarCierreDestino) { setMostrarCierreDestino(true); return; }
            if (!destinoFinal.tipoManejo || destinoFinal.cantidadEntregada === "" || Number(destinoFinal.cantidadEntregada) < 0) {
                sendMessage("Completa el tipo de manejo y la cantidad entregada por el destino.", "Advertencia");
                return;
            }
            if (!responsableDestinoId) {
                sendMessage("Registra y selecciona un responsable del destino que tenga firma vigente.", "Advertencia");
                return;
            }
        }
        setLoading(true);
        try {
            const response = await axios.patch(`/certificaciones/verificarManifiesto/${selected._id}`, {
                estado: nuevoEstado, observaciones: comentario, destinoFinal, otrosManejos, responsableDestinoId,
            });
            sendMessage(response.data.message, response.data.type || "Correcto");
            reload();
            setShowVerify(false);
        } catch (error) {
            console.error("Error en verificación:", error);
            sendMessage(error.response?.data?.message || "Error al procesar la verificación", "Error");
        } finally { setLoading(false); }
    };

    const getEstadoColor = (estado) => ({
        PENDIENTE: "text-yellow-500", RECHAZADO: "text-red-500", APROBADO: "text-green-500",
        OBSERVADO: "text-orange-500", ENVIADO: "text-blue-500", "EN REVISION": "text-purple-500",
    }[estado] || "text-gray-500");
    const hayOtroManejo = otrosManejos.comercializacion || otrosManejos.exportacion || otrosManejos.otro;
    const inputClass = "mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none";

    return (
        <div className="w-screen h-screen fixed top-0 right-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl bg-gradient-to-tr from-[#f9fafb] to-[#f3f4f6] rounded-xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                <button onClick={() => setShowVerify(false)} className="absolute top-2 right-2 h-12 w-12 text-white rounded-full bg-gradient-to-tr from-[#2b5993] to-[#418fda] shadow-lg hover:scale-95 active:scale-90 transition-all flex items-center justify-center z-50 focus:outline-none"><span className="pi pi-times text-2xl font-bold" /></button>
                <div className="p-6 border-b border-gray-200/60 bg-white/60">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#2b5993] to-[#418fda] bg-clip-text text-transparent flex items-center gap-2"><span className="pi pi-shield text-2xl text-[#4378b9]" />Evaluación y Verificación de Manifiesto</h3>
                    <p className="text-md text-gray-400 mt-1">N° Documento: {selected?.numeroManifiesto}</p>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {mostrarCierreDestino ? <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-5">
                        <div><h4 className="font-semibold text-blue-950">Cierre de recepción — Destino final</h4><p className="text-sm text-blue-800">Este bloque se registra únicamente al aprobar. La fecha, hora y las firmas se sellan por el servidor.</p></div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 rounded-lg bg-white/70 p-3 text-sm">
                            <div><span className="block text-slate-500">EO-RS destino final</span><strong>{destino?.razonSocial || "Tower"}</strong></div>
                            <div><span className="block text-slate-500">RUC</span><strong>{destino?.ruc || "—"}</strong></div>
                            <div><span className="block text-slate-500">Registro EO-RS</span><strong>{destino?.codigoRegistroEors || "—"}</strong></div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700">Tipo de manejo *<select value={destinoFinal.tipoManejo} onChange={(event) => actualizarDestino("tipoManejo", event.target.value)} className={inputClass}><option value="">Seleccionar</option><option value="TRATAMIENTO">Tratamiento</option><option value="DISPOSICIÓN FINAL">Disposición final</option><option value="VALORIZACIÓN">Valorización</option></select></label>
                            <label className="text-sm font-medium text-slate-700">Cantidad entregada (toneladas) *<input type="number" min="0" step="0.01" value={destinoFinal.cantidadEntregada} onChange={(event) => actualizarDestino("cantidadEntregada", event.target.value)} className={inputClass} /></label>
                        </div>
                        <label className="block text-sm font-medium text-slate-700">Observaciones del destino<textarea value={destinoFinal.observaciones} onChange={(event) => actualizarDestino("observaciones", event.target.value)} rows={3} className={inputClass} /></label>
                        <div className="border-t border-blue-200 pt-4"><label className="block text-sm font-medium text-slate-700">Responsable EO-RS que firma la recepción *<select value={responsableDestinoId} onChange={(event) => setResponsableDestinoId(event.target.value)} className={inputClass}><option value="">Seleccionar</option>{responsablesConFirma.map((responsable) => <option key={responsable._id} value={responsable._id}>{responsable.nombre} · DNI {responsable.dni || "—"} · {responsable.cargo || "Sin cargo"}</option>)}</select></label>{!responsablesConFirma.length && <p className="mt-2 text-sm text-rose-600">El destino no tiene responsables con firma vigente. Registra la firma en Destinos antes de aprobar.</p>}</div>
                        <div className="border-t border-blue-200 pt-4 space-y-3">
                            <h5 className="font-semibold text-slate-800">Otros manejos</h5>
                            <div className="flex flex-wrap gap-5 text-sm text-slate-700">{[["comercializacion", "Comercialización"], ["exportacion", "Exportación"], ["otro", "Otro"]].map(([campo, etiqueta]) => <label key={campo} className="flex items-center gap-2"><input type="checkbox" checked={otrosManejos[campo]} onChange={() => alternarOtroManejo(campo)} />{etiqueta}</label>)}</div>
                            {hayOtroManejo && <div className="grid grid-cols-1 gap-3 md:grid-cols-3 rounded-lg bg-white/70 p-3">
                                <label className="text-sm">Razón social del receptor<input value={otrosManejos.razonSocialReceptor} onChange={(event) => actualizarOtros("razonSocialReceptor", event.target.value.toUpperCase())} className={inputClass} /></label>
                                <label className="text-sm">RUC del receptor<input value={otrosManejos.rucReceptor} onChange={(event) => actualizarOtros("rucReceptor", event.target.value)} className={inputClass} /></label>
                                <label className="text-sm">Correo electrónico<input type="email" value={otrosManejos.correoReceptor} onChange={(event) => actualizarOtros("correoReceptor", event.target.value.toLowerCase())} className={inputClass} /></label>
                                <label className="text-sm">Teléfono<input value={otrosManejos.telefonoReceptor} onChange={(event) => actualizarOtros("telefonoReceptor", event.target.value)} className={inputClass} /></label>
                                <label className="text-sm">Tipo de manejo realizado<input value={otrosManejos.tipoManejo} onChange={(event) => actualizarOtros("tipoManejo", event.target.value.toUpperCase())} className={inputClass} /></label>
                                <label className="text-sm">Dirección / país de destino<input value={otrosManejos.direccionDestino} onChange={(event) => actualizarOtros("direccionDestino", event.target.value.toUpperCase())} className={inputClass} /></label>
                                <label className="text-sm md:col-span-3">Documento que aprueba<input value={otrosManejos.documentoAprueba} onChange={(event) => actualizarOtros("documentoAprueba", event.target.value.toUpperCase())} className={inputClass} /></label>
                            </div>}
                        </div>
                    </section> : <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 p-5 rounded-xl border border-gray-100 shadow-inner text--lg">
                            <div className="text-gray-700"><strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Generador:</strong><span className="font-medium text-gray-800">{selected?.generadorId?.razonSocial || "N/A"}</span></div>
                            <div className="text-gray-700"><strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Transportista:</strong><span className="font-medium text-gray-800">{selected?.transportistaId?.razonSocial || "N/A"}</span></div>
                            <div className="text-gray-700"><strong className="text-gray-400 block text-md uppercase font-semibold mb-0.5">Residuo:</strong><span className="font-medium text-gray-800">{selected?.residuo?.descripcion || "N/A"}</span></div>
                            <div className="text-gray-700"><span className="text-md text-gray-400 font-semibold uppercase">Estado actual:</span><div className={`font-medium ${getEstadoColor(selected?.estado)}`}>{selected?.estado}</div></div>
                        </div>
                        {!puedeEvaluarDestino && <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">Este manifiesto no está disponible para revisión en su estado actual.</div>}
                        <div className="flex flex-col gap-2"><label className="font-semibold text-gray-700 flex items-center gap-1.5 text-md"><span className="pi pi-comment text-gray-400" />Comentarios / Observaciones de Revisión:</label><InputTextarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4} placeholder="Especifica detalladamente los motivos del rechazo, las observaciones técnicas que deben subsanarse o notas aclaratorias de aprobación..." className="p-3 border border-gray-200 focus:border-blue-400 focus:shadow-md rounded-xl w-full bg-white transition-all resize-none shadow-inner text--lg outline-none" /></div>
                    </>}
                </div>
                <div className="p-4 border-t border-gray-200/60 bg-white/60 flex flex-wrap justify-around gap-3">
                    {mostrarCierreDestino ? <><button disabled={loading} onClick={() => setMostrarCierreDestino(false)} className="bg-slate-500 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40">Volver a la revisión</button><button disabled={loading} onClick={() => handleDecision("APROBADO")} className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40">{loading && <span className="pi pi-spin pi-spinner mr-2" />}Confirmar aprobación y firmar</button></> : <><button disabled={loading || !puedeEvaluarDestino} onClick={() => handleDecision("RECHAZADO")} className="bg-gradient-to-tr from-rose-500 to-red-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40">{loading && <span className="pi pi-spin pi-spinner mr-2" />}Rechazar por completo</button><button disabled={loading || !puedeObservar} onClick={() => handleDecision("OBSERVADO")} className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40">{loading && <span className="pi pi-spin pi-spinner mr-2" />}Observar manifiesto</button><button disabled={loading || !puedeEvaluarDestino} onClick={() => handleDecision("APROBADO")} className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white font-semibold text-md px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40">Aprobar y firmar</button></>}
                </div>
            </div>
        </div>
    );
};

export default VerificarManifiesto;
