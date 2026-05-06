import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";

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
  } = selected;

  return (
    <Details setShowDetail={setShowDetail}>
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
            
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background-color: #bae6fd; /* un celeste muy suave (sky-200) */
            border-radius: 20px;
          }
          .custom-scroll::-webkit-scrollbar-button:single-button {
      background-color: transparent;
      display: block;
      height: 10px; /* Aquí controlas exactamente cuánto "aire" hay arriba y abajo */
      width: 20px;
    }
        `}
      </style>
      <div className="flex justify-evenly gap-6 h-full w-full overflow-hidden p-3">
        <div className="flex-1 overflow-y-auto custom-scroll rounded-2xl shadow-md bg-white p-4">
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
              <PDetail content="CANTIDAD: " value={item.cantidad} />
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
              <PDetail
                content="UBICACIÓN: "
                value={item.ubicacionId ? `${item.ubicacionId?.zonaId?.nombre || ""}, ${item.ubicacionId?.rack || ""}, SECCION: ${item.ubicacionId?.nivel || ""} - ${item.ubicacionId?.seccion || ""}` : "Aún no asignado"}
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
              content="N° DOCUMENTO (DNI/RUC): "
              value={numeroDocumento}
            />
          </div>
          <div className="mt-6">
            <h3 className="text-3xl mb-5 font-bold">OTROS</h3>
            <PDetail
              content="NOMBRES:"
              value={`${creadoPor?.name || ""} ${creadoPor?.lastname || ""}`}
            />
            <PDetail content="EMAIL: " value={creadoPor?.email} />
            <PDetail content="SEDE: " value={sedeId?.nombre} />
            <PDetail content="OBSERVACIONES: " value={observaciones} />
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
        </div>
      </div>
    </Details>
  );
};

export default DetailLurin;
