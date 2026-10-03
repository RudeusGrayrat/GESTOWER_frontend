import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const ViewBoletaDePago = ({ setShowDetail, selected }) => {
  const [office, setOffice] = useState(null);
  const [cargandoOffice, setCargandoOffice] = useState(true);
  const [errorOffice, setErrorOffice] = useState("");
  const [generandoWord, setGenerandoWord] = useState(false);
  const [generandoPdf, setGenerandoPdf] = useState(false);
  const sendMessage = useSendMessage();

  const cargarOffice = async (boletaId, activo = () => true) => {
    if (!boletaId) return;
    setCargandoOffice(true);
    setErrorOffice("");
    try {
      const response = await axios.get(`/boletas/${boletaId}/office-preview`);
      if (activo()) setOffice(response.data);
    } catch (error) {
      if (activo()) {
        console.error("Error al preparar la vista previa de Office:", error);
        setErrorOffice("No se pudo preparar la vista previa de Office. Puedes intentarlo nuevamente.");
      }
    } finally {
      if (activo()) setCargandoOffice(false);
    }
  };

  useEffect(() => {
    let activo = true;
    setOffice(null);
    cargarOffice(selected?._id, () => activo);
    return () => { activo = false; };
  }, [selected?._id]);

  const nombreArchivo = () => {
    const fecha = selected?.fechaBoletaDePago?.replace(/\//g, "-") || "boleta";
    return `${selected?.colaborador?.lastname || ""}_${selected?.colaborador?.name || ""}_${fecha}.docx`;
  };

  const descargar = (url, nombre) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const descargarWord = async () => {
    if (!selected?._id) return;
    setGenerandoWord(true);
    try {
      const response = await axios.get(`/boletas/${selected._id}/docx`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }));
      descargar(url, nombreArchivo());
      URL.revokeObjectURL(url);
    } catch (error) {
      sendMessage(error.message || "No se pudo generar el documento Word.", "Error");
    } finally {
      setGenerandoWord(false);
    }
  };

  const abrirOffice = () => {
    if (!office?.viewUrl) return;
    // `noopener` hace que algunos navegadores devuelvan null aunque la pestaña sí abra.
    const nuevaPestana = window.open("", "_blank");
    if (!nuevaPestana) {
      sendMessage("Permite las ventanas emergentes para abrir la boleta en Office.", "Error");
      return;
    }
    nuevaPestana.opener = null;
    nuevaPestana.location.replace(office.viewUrl);
  };

  const obtenerPdf = async () => {
    if (!selected?._id) return null;
    setGenerandoPdf(true);
    try {
      const response = await axios.get(`/boletas/${selected._id}/pdf`, { responseType: "blob" });
      return new Blob([response.data], { type: "application/pdf" });
    } catch (error) {
      sendMessage("No se pudo generar el PDF de la boleta.", "Error");
      return null;
    } finally {
      setGenerandoPdf(false);
    }
  };

  const descargarPdf = async () => {
    const pdf = await obtenerPdf();
    if (!pdf) return;
    const url = URL.createObjectURL(pdf);
    descargar(url, nombreArchivo().replace(/\.docx$/i, ".pdf"));
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const verPdf = async () => {
    const nuevaPestana = window.open("", "_blank");
    if (!nuevaPestana) {
      sendMessage("Permite las ventanas emergentes para ver el PDF.", "Error");
      return;
    }
    const pdf = await obtenerPdf();
    if (!pdf) {
      nuevaPestana.close();
      return;
    }
    const url = URL.createObjectURL(pdf);
    nuevaPestana.opener = null;
    nuevaPestana.location.replace(url);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <Details setShowDetail={setShowDetail} title="Boleta de Pago">
      <section className="min-h-0 h-full flex flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Boleta de pago</h2>
            <p className="text-sm text-slate-500">Vista previa Word mediante Office Online.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={abrirOffice} disabled={!office} className="rounded-xl bg-gradient-to-r from-[#2b5993] to-[#418fda] px-4 py-2 font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-external-link mr-2" />Abrir en Office
            </button>
            <button type="button" onClick={verPdf} disabled={generandoPdf} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-eye mr-2 text-red-600" />{generandoPdf ? "Generando PDF..." : "Ver PDF"}
            </button>
            <button type="button" onClick={descargarPdf} disabled={generandoPdf} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-file-pdf mr-2 text-red-600" />Descargar PDF
            </button>
            <button type="button" onClick={descargarWord} disabled={generandoWord} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-file-word mr-2 text-[#2b5993]" />{generandoWord ? "Generando Word..." : "Descargar Word"}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-slate-100 shadow-inner">
          {cargandoOffice && <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 text-slate-500"><i className="pi pi-spin pi-spinner text-3xl text-[#2b5993]" /><span>Preparando vista previa de Office...</span></div>}
          {!cargandoOffice && errorOffice && <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-4 p-8 text-center text-slate-500"><i className="pi pi-exclamation-triangle text-3xl text-amber-500" /><span>{errorOffice}</span><button type="button" onClick={() => cargarOffice(selected?._id)} className="rounded-xl bg-[#2b5993] px-4 py-2 font-semibold text-white">Reintentar</button></div>}
          {!cargandoOffice && office?.embedUrl && <iframe title="Vista previa de boleta en Office" src={office.embedUrl} className="h-full min-h-[38rem] w-full border-0" allowFullScreen />}
        </div>
      </section>
    </Details>
  );
};

export default ViewBoletaDePago;
