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
    referenciaImagen,
    fechaSalida,
    horaSalida,
    detallesDePeso,
  } = selected;
  console.log(selected)
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
              <h4 className="text-xl font-semibold mb-2">REFERENCIA FOTOGRÁFICA</h4>
              <img src={referenciaImagen} alt="Referencia Fotográfica" className="max-w-full h-auto" />
            </div>
          )}
        </div>
      </div>
    </Details>
  );
};

export default DetailLurin;
