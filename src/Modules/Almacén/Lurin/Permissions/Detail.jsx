import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios";

const DetailLurin = ({ setShowDetail, selected }) => {
  if (!selected) return null;

  const {
    correlativa,
    movimiento,
    codigoIngreso,
    contratoId,
    sedeId,
    datosGenerales,
    descripcionBienes,
    creadoPor,
    numeroDeActa,
    numeroDocumento,
    observaciones,
    referenciaImagen,
    fechaSalida,
    horaSalida,
    detallesDePeso,
  } = selected;
  console.log(selected)
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState(null);
  const sendMessage = useSendMessage();
  const fileName = `${selected?.correlativa || 'Acta'}_${selected?.numeroDeActa?.replace(/\//g, "-") || ''}`;

  useEffect(() => {
    const fetchPdf = async () => {
      if (!selected) return;
      setLoading(true);
      setPdfBlob(null);
      try {
        // Hacemos la petición al backend para que genere el PDF con LibreOffice
        const response = await axios.get(`/almacenLurin/getPDFMovimiento/${selected._id}`, {
          responseType: "blob",
        });

        // Guardamos el archivo en el estado (como hacías con fileGenerated)
        setPdfBlob(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el PDF:", error);
        setLoading(false);
        sendMessage("Error al generar la vista previa del PDF", "Error");
      } finally {
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
    <Details setShowDetail={setShowDetail}>
      <div className="flex justify-evenly gap-6 h-full w-full overflow-hidden p-3">
        <div className="flex-1 overflow-y-auto  rounded-2xl shadow-md bg-white p-4">
          <h3 className="text-2xl text-sky-700 mb-3 font-bold">DESCRIPCIONES DE BIENES</h3>
          {descripcionBienes?.map((item, index) => (
            <div
              key={item._id || index}
              className="mb-4 border-b border-gray-300 pb-2"
            >
              <h4 className="text-xl font-semibold mb-2">ITEM #{item.item}</h4>
              <PDetail
                content="PRODUCTO: "
                value={item.descripcion}
              />
              <PDetail content="CANTIDAD INGRESADA: " value={item.cantidadIngresada} />
              <PDetail
                content="UNIDAD: "
                value={item.unidadDeMedida}
              />
              <PDetail content="SUBITEM: " value={item.subItem} />
              <PDetail
                content="PESO NETO: "
                value={item.pesoNeto}
              />
              <PDetail
                content="PESO BRUTO: "
                value={item.pesoBruto}
              />

              <PDetail content="ESTADO ENVASE: " value={item.estadoEnvase} />
              <PDetail content="OBSERVACIONES: " value={item.observaciones || ""} />
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto rounded-2xl shadow-md bg-white p-4">
          <div>
            <h3 className="text-3xl font-bold mb-5">DATOS BÁSICOS</h3>
            <PDetail content="CONTRATO: " value={contratoId?.cliente} />
            <PDetail content="CORRELATIVA: " value={correlativa} />
            <PDetail content="MOVIMIENTO: " value={movimiento} />
            {movimiento === "SALIDA" && (
              <PDetail content="CÓDIGO INGRESO: " value={codigoIngreso} />
            )}
            <PDetail content="N° ACTA: " value={numeroDeActa} />
            <PDetail
              content="N° DOCUMENTO: "
              value={numeroDocumento}
            />
          </div>
          <div className="mt-6">
            <h3 className="text-3xl mb-5 font-bold">OTROS</h3>
            <PDetail content="FECHA DE SALIDA: " value={fechaSalida} />
            <PDetail content="HORA DE SALIDA: " value={horaSalida} />
            <PDetail content="DETALLES DE PESO: " value={detallesDePeso} />
            <PDetail content="OBSERVACIONES: " value={observaciones} />
            <PDetail content="CREADO POR: " value={`${selected?.creadoPor?.name || ""} ${selected?.creadoPor?.lastname || ""}`} />
            <PDetail content="APROBADO POR: " value={`${selected?.aprobadoPor?.name || ""} ${selected?.aprobadoPor?.lastname || ""}`} />
          </div>
          <div>
            {!loading && pdfBlob ? (
              <div className="flex gap-8 m-2">
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
              <div className="flex flex-col items-center m-2">
                <span className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></span>
                <p className="text-gray-500 animate-pulse">
                  Generando documento PDF... Esto puede tardar unos segundos..
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-2xl shadow-md bg-white p-4">
          <h3 className="text-3xl mb-5 font-bold">DATOS GENERALES</h3>
          <PDetail content="FECHA: " value={datosGenerales?.fecha} />
          <PDetail
            content="HORA INGRESO: "
            value={datosGenerales?.horaIngreso}
          />
          <PDetail
            content="RECEPCIONADO POR: "
            value={datosGenerales?.recepcionadoPor}
          />
          <PDetail
            content="DNI RECEPCIONADO POR: "
            value={datosGenerales?.dniRecepcionadoPor}
          />
          <PDetail
            content="RESPONSABLE ENTREGA: "
            value={datosGenerales?.responsableEntrega}
          />
          <PDetail
            content="REGISTRO OCIP: "
            value={datosGenerales?.registroOCIP}
          />
          <PDetail content="ESTADO ACTA: " value={datosGenerales?.estadoActa} />
          {referenciaImagen && (
            <div className="mt-4">
              <h4 className="text-xl font-semibold mb-2">REFERENCIAS FOTOGRÁFICAS</h4>
              {referenciaImagen?.map((img, index) => (
                <img key={index} src={img} alt={`Referencia Fotográfica ${index + 1}`} className="max-w-full h-auto mb-2" />
              ))}
            </div>
          )}
        </div>
      </div>
    </Details>
  );
};

export default DetailLurin;
