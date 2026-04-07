import Details from "../../../../../components/Principal/Permissions/View";
import PDetail from "../../../../../recicle/PDtail";

const DetailAsistenciaColaborador = ({ setShowDetail, selected }) => {
  const {
    fecha,
    ingreso,
    ingresoSede,
    salida,
    salidaSede,
    inicioAlmuerzo,
    finAlmuerzo,
    almuerzoSede,
    colaborador,
    minTarde,
    minExtras,
    observaciones,
    estado,
  } = selected;

  const {
    name,
    lastname,
    photo,
  } = colaborador;

  return (
    <Details setShowDetail={setShowDetail}>
      <div className="flex justify-around gap-8 ">
        <div className="flex flex-col bg-white shadow-md rounded-lg p-6 gap-2">
          <h3 className="text-3xl mb-2 font-bold text-[#026DCC]">DATOS DE LA ASISTENCIA</h3>
          <PDetail content="FECHA: " value={fecha} />
          <PDetail content="HORA DE INGRESO: " value={ingreso} />
          <PDetail content="SEDE DE INGRESO: " value={ingresoSede} />
          <PDetail content="HORA DE SALIDA: " value={salida} />
          <PDetail content="SEDE DE SALIDA: " value={salidaSede} />
          <PDetail content="INICIO DE ALMUERZO: " value={inicioAlmuerzo} />
          <PDetail content="FIN DE ALMUERZO: " value={finAlmuerzo} />
          <PDetail content="SEDE DE ALMUERZO: " value={almuerzoSede} />
          <PDetail content="ESTADO: " value={estado} />
          <PDetail content="MINUTOS DE TARDANZA: " value={minTarde} />
          <PDetail content="MINUTOS DE HORAS EXTRAS: " value={minExtras} />
          <PDetail content="OBSERVACIONES: " value={observaciones} />
        </div>

        <div className="flex flex-col bg-white shadow-md rounded-lg p-6 gap-2">
          <h3 className="text-3xl mb-2 font-bold text-[#026DCC]">DATOS DEL COLABORADOR</h3>
          <PDetail content="NOMBRES: " value={name} />
          <PDetail content="APELLIDOS: " value={lastname} />
          <PDetail content="FOTO: " value={<img
            src={photo ? photo : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Foto del colaborador"
            className="w-32 h-32  object-cover m-2"
          />} />
        </div>

      </div>
    </Details>
  );
};

export default DetailAsistenciaColaborador;
