// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { limpiarPlantilla } from "./LimpiarPlantilla";
import renderManifiesto from "./RenderManifiesto";

const { VITE_PLANTILLA_MANIFIESTO_WORD } = import.meta.env;

const DetailManifiesto = ({ setShowDetail, selected }) => {
  const [showDoc, setShowDoc] = useState(false);
  const [docxContent, setDocxContent] = useState("");
  const [cargandoPDF, setCargandoPDF] = useState(false);
  const [plantillaLimpiaUrl, setPlantillaLimpiaUrl] = useState(null);
  const [error, setError] = useState(null);

  // PASO 1: Limpiar la plantilla al cargar
  useEffect(() => {
    const limpiar = async () => {
      try {
        console.log("🧹 Limpiando plantilla original...");
        const url = await limpiarPlantilla(VITE_PLANTILLA_MANIFIESTO_WORD);
        setPlantillaLimpiaUrl(url);
        console.log("✅ Plantilla limpia lista");
      } catch (err) {
        console.error("❌ Error limpiando plantilla:", err);
        setError("No se pudo limpiar la plantilla");
      }
    };

    limpiar();

    // Cleanup: liberar URL cuando el componente se desmonte
    return () => {
      if (plantillaLimpiaUrl) {
        URL.revokeObjectURL(plantillaLimpiaUrl);
      }
    };
  }, []);

  // PASO 2: Generar manifiesto con la plantilla limpia
  useEffect(() => {
    if (!plantillaLimpiaUrl || !selected || error) return;

    const renderDocx = async () => {
      try {
        console.log("🎯 Renderizando manifiesto...");

        // Usar la plantilla limpia (URL temporal)
        const archivoWord = await renderManifiesto(
          selected,
          plantillaLimpiaUrl, // ← URL temporal de la plantilla limpia
          `Manifiesto_${selected.numeroManifiesto || selected._id}`
        );

        if (!archivoWord) {
          throw new Error("No se pudo generar el Word");
        }

        console.log("✅ Word generado, tamaño:", archivoWord.size, "bytes");

        // Subir a Cloudinary (para tenerlo permanente)
        const nombreArchivo = `Manifiesto_${selected.numeroManifiesto || selected._id}_${Date.now()}`;
        const cloudinaryResponse = await documentoCloudinary(archivoWord, nombreArchivo);

        if (!cloudinaryResponse?.secure_url) {
          throw new Error("Error al subir a Cloudinary");
        }

        setDocxContent(cloudinaryResponse.secure_url);
        setShowDoc(true);

      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      }
    };

    renderDocx();
  }, [selected, plantillaLimpiaUrl]);
  const convertirAPDF = async () => {
    setCargandoPDF(true);
    try {

      const pdfResponse = await axios.post("/returnPdf", {
        archivoUrlDocx: docxContent
      }, {
        responseType: 'blob'
      });

      // Crear URL del PDF y abrirlo
      const pdfUrl = URL.createObjectURL(pdfResponse.data);
      window.open(pdfUrl, '_blank');

    } catch (error) {
      console.error("Error convirtiendo a PDF:", error);
    } finally {
      setCargandoPDF(false);
    }
  };
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docxContent)}&embedded=true`;
  const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(docxContent)}`;

  const descargarWord = () => {
    window.open(docxContent, '_blank');
  };

  if (error) {
    return (
      <Details setShowDetail={setShowDetail} title="Error">
        <div className="p-4 text-red-600">
          Error: {error}
        </div>
      </Details>
    );
  }

  return (
    <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
      {showDoc ? (
        <div className="flex flex-col space-y-4 h-full p-4">
          <div className="flex justify-center space-x-4">
            <ButtonOk type="ok" onClick={convertirAPDF}>
              Ver como PDF
            </ButtonOk>
            <ButtonOk>
              <a
                href={googleDocsViewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white no-underline"
              >
                Ver en una nueva pestaña
              </a>
            </ButtonOk>
          </div>

          {cargandoPDF ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Convirtiendo a PDF, no cierre o se cancelará...</p>
            </div>
          ) : (
            <div className="mt-4 border rounded-lg overflow-hidden h-full">
              <iframe
                src={googleDocsViewerUrl}
                className="w-full h-full"
                title="Vista previa del manifiesto"
              />
            </div>)}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Generando manifiesto...</p>
        </div>
      )}

    </Details>
  );
};

export default DetailManifiesto;