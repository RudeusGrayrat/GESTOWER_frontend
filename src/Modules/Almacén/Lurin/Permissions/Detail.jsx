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
  console.log("selected", selected);

  return (
    <Details setShowDetail={setShowDetail}>
      <div className="flex justify-start flex-wrap ">
        <div className="">
          <h3 className="text-3xl mb-5 font-bold">DESCRIPCIONES DE BIENES</h3>
          {descripcionBienes?.map((item, index) => (
            <div
              key={item._id || index}
              className="mb-4 border-b border-gray-300 pb-2"
            >
              <h4 className="text-2xl font-semibold mb-2">ITEM {item.item}</h4>
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
        <div className="mx-10">
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
        <div>
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
