import { useEffect, useRef, useState } from "react";
import renderDoc from "../Enviar/renderDoc";
import { useDispatch, useSelector } from "react-redux";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import { getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";

const ViewBoletaDePago = ({ setShowDetail, selected }) => {
  const [estadoDocumento, setEstadoDocumento] = useState("Genera la vista previa cuando la necesites.");
  const [documento, setDocumento] = useState(null);
  const [generando, setGenerando] = useState(false);
  const urlDocumento = useRef("");
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();
  const datosContables = useSelector((state) => state.recursosHumanos.datosContables || []);

  useEffect(() => {
    if (!datosContables.length) dispatch(getDatosContables());
  }, [dispatch, datosContables.length]);
  const business = selected?.empresaColaborador;

  useEffect(() => {
    setDocumento(null);
    setEstadoDocumento("Genera la vista previa cuando la necesites.");
    if (urlDocumento.current) {
      URL.revokeObjectURL(urlDocumento.current);
      urlDocumento.current = "";
    }
  }, [selected?._id]);

  useEffect(() => {
    return () => {
      if (urlDocumento.current) URL.revokeObjectURL(urlDocumento.current);
    };
  }, []);

  const nombreArchivo = () => {
    const fechaConGuion = selected?.fechaBoletaDePago?.replace(/\//g, "-") || "boleta";
    return `${selected?.colaborador?.lastname || ""}_${selected?.colaborador?.name || ""}_${fechaConGuion}.docx`;
  };

  const generarDocumento = async () => {
    if (documento) return documento;
    if (!selected || !business || !datosContables.length) {
      setEstadoDocumento("Aún se están cargando los datos necesarios para la boleta.");
      return null;
    }

    setGenerando(true);
    setEstadoDocumento("Generando boleta...");
    try {
      const file = await renderDoc(
        {
          ...selected,
          regimenPension: selected.colaborador?.regimenPension || "",
          codigoSpp: selected.codigoSpp || selected.colaborador?.codigoSpp || "",
        },
        business,
        datosContables
      );
      if (!file) throw new Error("No se pudo generar el documento.");

      setDocumento(file);
      setEstadoDocumento("Vista previa lista.");
      return file;
    } catch (error) {
      setEstadoDocumento("No se pudo generar el documento.");
      sendMessage(error.message || String(error), "Error");
      return null;
    } finally {
      setGenerando(false);
    }
  };

  const descargarWord = async () => {
    const file = await generarDocumento();
    if (!file) return;

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const abrirBoleta = async () => {
    const file = await generarDocumento();
    if (!file) return;

    if (urlDocumento.current) URL.revokeObjectURL(urlDocumento.current);
    urlDocumento.current = URL.createObjectURL(file);
    const nuevaPestana = window.open(urlDocumento.current, "_blank");
    if (!nuevaPestana) {
      setEstadoDocumento("El navegador bloqueó la nueva pestaña.");
      sendMessage("Permite las ventanas emergentes para visualizar la boleta.", "Error");
    } else {
      nuevaPestana.opener = null;
    }
  };

  return (
    <Details setShowDetail={setShowDetail} title="Boleta de Pago">
      <section className="min-h-0 h-full flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800">Boleta de pago</h2>
          <p className="text-sm text-slate-500">{estadoDocumento} La boleta se abre en una pestaña nueva.</p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={abrirBoleta}
            disabled={generando}
            className="rounded-xl bg-gradient-to-r from-[#2b5993] to-[#418fda] px-5 py-2.5 font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="pi pi-eye mr-2" />
            {generando ? "Generando..." : "Abrir boleta"}
          </button>
          <button
            type="button"
            onClick={descargarWord}
            disabled={generando}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="pi pi-file-word mr-2 text-[#2b5993]" />
            Descargar Word
          </button>
        </div>

        <div className="min-h-0 flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 shadow-inner">
          <div className="flex h-full min-h-[18rem] items-center justify-center text-center text-slate-500">
            Usa <strong className="mx-1 text-slate-700">Abrir boleta</strong> para verla en otra pestaña o descarga el archivo Word.
          </div>
        </div>
      </section>
    </Details>
  );
};

export default ViewBoletaDePago;
