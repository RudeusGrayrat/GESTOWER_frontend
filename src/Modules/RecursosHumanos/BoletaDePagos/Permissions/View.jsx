import { useEffect, useRef, useState } from "react";
import renderDoc from "../Enviar/renderDoc";
import { useDispatch, useSelector } from "react-redux";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import { getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";
import axios from "../../../../api/axios";

const ViewBoletaDePago = ({ setShowDetail, selected }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [cargandoPdf, setCargandoPdf] = useState(true);
  const [errorPdf, setErrorPdf] = useState("");
  const [generandoWord, setGenerandoWord] = useState(false);
  const urlPdf = useRef("");
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();
  const datosContables = useSelector((state) => state.recursosHumanos.datosContables || []);
  const business = selected?.empresaColaborador;

  useEffect(() => {
    if (!datosContables.length) dispatch(getDatosContables());
  }, [dispatch, datosContables.length]);

  const cargarPdf = async (boletaId, activo = () => true) => {
    if (!boletaId) return;
    setCargandoPdf(true);
    setErrorPdf("");
    try {
      const response = await axios.get(`/boletas/${boletaId}/pdf`, { responseType: "blob" });
      if (!activo()) return;
      const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      if (urlPdf.current) URL.revokeObjectURL(urlPdf.current);
      urlPdf.current = url;
      setPdfUrl(url);
    } catch (error) {
      if (activo()) {
        console.error("Error al generar la vista previa de la boleta:", error);
        setErrorPdf("No se pudo generar la vista previa. Puedes intentarlo nuevamente.");
      }
    } finally {
      if (activo()) setCargandoPdf(false);
    }
  };

  useEffect(() => {
    let activo = true;
    setPdfUrl("");
    if (urlPdf.current) {
      URL.revokeObjectURL(urlPdf.current);
      urlPdf.current = "";
    }
    cargarPdf(selected?._id, () => activo);
    return () => {
      activo = false;
      if (urlPdf.current) {
        URL.revokeObjectURL(urlPdf.current);
        urlPdf.current = "";
      }
    };
  }, [selected?._id]);

  const nombreArchivo = (extension) => {
    const fecha = selected?.fechaBoletaDePago?.replace(/\//g, "-") || "boleta";
    return `${selected?.colaborador?.lastname || ""}_${selected?.colaborador?.name || ""}_${fecha}.${extension}`;
  };

  const generarWord = async () => {
    if (!selected || !business || !datosContables.length) {
      sendMessage("Aún se están cargando los datos necesarios para generar Word.", "Error");
      return null;
    }
    setGenerandoWord(true);
    try {
      return await renderDoc({
        ...selected,
        regimenPension: selected.colaborador?.regimenPension || "",
        codigoSpp: selected.codigoSpp || selected.colaborador?.codigoSpp || "",
      }, business, datosContables);
    } catch (error) {
      sendMessage(error.message || "No se pudo generar el documento Word.", "Error");
      return null;
    } finally {
      setGenerandoWord(false);
    }
  };

  const descargar = (url, nombre) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const descargarPdf = () => pdfUrl && descargar(pdfUrl, nombreArchivo("pdf"));
  const abrirPdf = () => {
    if (!pdfUrl) return;
    if (!window.open(pdfUrl, "_blank", "noopener,noreferrer")) {
      sendMessage("Permite las ventanas emergentes para abrir la boleta.", "Error");
    }
  };
  const descargarWord = async () => {
    const file = await generarWord();
    if (!file) return;
    const url = URL.createObjectURL(file);
    descargar(url, nombreArchivo("docx"));
    URL.revokeObjectURL(url);
  };

  return (
    <Details setShowDetail={setShowDetail} title="Boleta de Pago">
      <section className="min-h-0 h-full flex flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Boleta de pago</h2>
            <p className="text-sm text-slate-500">Vista previa PDF de la boleta generada.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={abrirPdf} disabled={!pdfUrl} className="rounded-xl bg-gradient-to-r from-[#2b5993] to-[#418fda] px-4 py-2 font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-external-link mr-2" />Abrir
            </button>
            <button type="button" onClick={descargarPdf} disabled={!pdfUrl} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-file-pdf mr-2 text-red-600" />Descargar PDF
            </button>
            <button type="button" onClick={descargarWord} disabled={generandoWord} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              <i className="pi pi-file-word mr-2 text-[#2b5993]" />{generandoWord ? "Generando Word..." : "Descargar Word"}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
          {cargandoPdf && <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 text-slate-500"><i className="pi pi-spin pi-spinner text-3xl text-[#2b5993]" /><span>Generando vista previa PDF...</span></div>}
          {!cargandoPdf && errorPdf && <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-4 p-8 text-center text-slate-500"><i className="pi pi-exclamation-triangle text-3xl text-amber-500" /><span>{errorPdf}</span><button type="button" onClick={() => cargarPdf(selected?._id)} className="rounded-xl bg-[#2b5993] px-4 py-2 font-semibold text-white">Reintentar</button></div>}
          {!cargandoPdf && pdfUrl && <iframe title="Vista previa de boleta" src={pdfUrl} className="h-full min-h-[38rem] w-full border-0" />}
        </div>
      </section>
    </Details>
  );
};

export default ViewBoletaDePago;
