// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { limpiarPlantilla } from "./LimpiarPlantilla";
import renderManifiesto from "./RenderManifiesto";
import useSendMessage from "../../../../recicle/senMessage";


const DetailManifiesto = ({ setShowDetail, selected }) => {
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState(null);
  const sendMessage = useSendMessage();

  // Nombre dinámico del archivo
  const fileName = `${selected?.numeroManifiesto || 'Reporte'}_${selected?.transporte?.fechaRecepcion?.replace(/\//g, "-") || ''}`;

  useEffect(() => {
    const fetchPdf = async () => {
      if (!selected) return;

      setLoading(true);
      setPdfBlob(null);

      try {
        // Hacemos la petición al backend para que genere el PDF con LibreOffice
        const response = await axios.get(`rrhh/getPdfManifiesto/${selected._id}`, {
          responseType: 'blob' // CRÍTICO: Recibir el PDF como binario
        });

        // Guardamos el archivo en el estado (como hacías con fileGenerated)
        setPdfBlob(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el PDF:", error);
        sendMessage("Error al generar la vista previa del PDF", "Error");
        setLoading(false);
      }
    };

    fetchPdf();
  }, [selected]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Limpieza inmediata
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handlePreview = () => {
    if (pdfBlob) {
      const fileURL = window.URL.createObjectURL(pdfBlob);
      window.open(fileURL, '_blank');
      // Nota: No revocamos la URL inmediatamente para que la pestaña pueda cargarla
    }
  };
  return (
    <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
      {!loading && pdfBlob ? (
        <div className="flex gap-8 mt-6 ml-10">
          {/* BOTÓN VISUALIZAR */}
          <div
            onClick={handlePreview}
            className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
          >
            <span>Visualizar PDF</span>
            <span className="ml-2 pi pi-eye"></span>
          </div>

          {/* BOTÓN DESCARGAR */}
          <div
            onClick={handleDownload}
            className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
          >
            <span>Descargar PDF</span>
            <span className="ml-2 pi pi-download"></span>
          </div>
        </div>
      ) : (
        /* Spinner de carga mientras el i5-14600KF y LibreOffice hacen la magia */
        <div className="flex flex-col items-center mt-10">
          <span className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></span>
          <p className="text-gray-500 animate-pulse">
            Generando documento PDF... Esto puede tardar unos segundos dependiendo de la complejidad del documento y el rendimiento del servidor.
          </p>
        </div>
      )}
    </Details>
  );
};

export default DetailManifiesto;