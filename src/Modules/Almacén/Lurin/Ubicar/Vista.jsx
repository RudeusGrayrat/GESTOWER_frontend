import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllSedesAlmacen,
  getNaveBySede,
  getZonasByParams,
} from "../../../../redux/modules/Almacen/actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";
import ZonaAlmacen from "../../Almacen/Zona";
import ViewUbicacion from "./ViewUbicacion";

const POSICIONES = {
  "NAVE-01-LU": {
    "ZONA-001": { xInicio: 12, yInicio: 19 },
    "ZONA-002": { xInicio: 18, yInicio: 9 },
    "ZONA-003": { xInicio: 12, yInicio: 3 },
    "ZONA-004": { xInicio: 6, yInicio: 3 },
    "ZONA-005": { xInicio: 2, yInicio: 9 },
    "ZONA-006": { xInicio: 6, yInicio: 19 },
    "ZONA-007": { xInicio: 6, yInicio: 15 },
    "ZONA-008": { xInicio: 12, yInicio: 15 },
    "ZONA-009": { xInicio: 6, yInicio: 11 },
    "ZONA-010": { xInicio: 12, yInicio: 11 },
    "ZONA-011": { xInicio: 6, yInicio: 7 },
    "ZONA-012": { xInicio: 12, yInicio: 7 },
  },
  "NAVE-02-LU": {
    "ZONA-013": { xInicio: 6, yInicio: 14 },
    "ZONA-014": { xInicio: 9, yInicio: 23 },
    "ZONA-015": { xInicio: 12, yInicio: 20 },
    "ZONA-016": { xInicio: 12, yInicio: 17 },
    "ZONA-017": { xInicio: 12, yInicio: 14 },
    "ZONA-018": { xInicio: 12, yInicio: 11 },
    "ZONA-019": { xInicio: 12, yInicio: 8 },
    "ZONA-020": { xInicio: 12, yInicio: 5 },
    "ZONA-021": { xInicio: 12, yInicio: 2 },
    "ZONA-022": { xInicio: 6, yInicio: 4 },
  },
};

const COLS = 20;
const ROWS = 21;

const VistaGeneral = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const naveParam = searchParams.get("nave") || "TODAS";
  const zonaParam = searchParams.get("zona") || "";

  const [navesLurin, setNavesLurin] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [isLoadingZonas, setIsLoadingZonas] = useState(false);
  const [isLoadingUbicaciones, setIsLoadingUbicaciones] = useState(false);
  const [viewUbicacion, setViewUbicacion] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);

  const Sede = "LURIN";
  const allSedesAlmacen = useSelector((state) => state.almacen.allSedes);
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (allSedesAlmacen.length === 0) dispatch(getAllSedesAlmacen());
  }, [dispatch, allSedesAlmacen.length]);

  const sedeId = allSedesAlmacen.find((s) => s.nombre === Sede);
  useEffect(() => {
    if (sedeId) getNaveBySede(sedeId._id).then(setNavesLurin);
  }, [sedeId]);

  const naveSeleccionadaObj = navesLurin.find((n) => n.nombre === naveParam);
  const naveId = naveSeleccionadaObj?._id || "";

  // Cargar zonas cuando cambia la nave
  useEffect(() => {
    if (!naveId || naveParam === "TODAS") return;
    setIsLoadingZonas(true);
    const posiciones = POSICIONES[naveParam] || {};
    getZonasByParams({ almacenId: naveId }).then((allZonas) => {
      const zonasConPos = allZonas.map((zona) => ({
        ...zona,
        ...(posiciones[zona.nombre] || { xInicio: 1, yInicio: 1 }),
      }));
      setZonas(zonasConPos);
      setIsLoadingZonas(false);
    });
  }, [naveId, naveParam]);

  // Cargar ubicaciones cuando se selecciona zona
  const getUbicaciones = async () => {
    setIsLoadingUbicaciones(true);
    try {
      axios
        .get("/getUbicacionByParams", { params: { zonaId: zonaParam } })
        .then((res) => setUbicaciones(res.data))
        .catch((err) => sendMessage(err?.response?.data?.message, "Error"))
        .finally(() => setIsLoadingUbicaciones(false));
    } catch (error) {
      sendMessage(error?.response?.data?.message, "Error");
      setIsLoadingUbicaciones(false);
    }
  };
  useEffect(() => {
    if (!zonaParam) return;
    getUbicaciones();
  }, [zonaParam]);

  const seleccionarNave = (nombre) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("nave", nombre);
      params.delete("zona");
      return params;
    });
  };

  const seleccionarZona = (zonaId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("zona", zonaId);
      return params;
    });
  };

  const handleAtras = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (zonaParam) {
        params.delete("zona");
      } else {
        params.set("nave", "TODAS");
        params.delete("zona");
      }
      return params;
    });
  };

  const mostrarAtras = naveParam !== "TODAS" || !!zonaParam;

  // zonaActual solo disponible cuando zonas ya cargaron
  const zonaActual = zonas.find((z) => z._id === zonaParam);

  const renderContenido = () => {
    // Nivel 1: Selección de nave
    if (naveParam === "TODAS") {
      return (
        <div className="w-full flex flex-col items-center">
          <div
            className="m-2 h-40 w-[900px] flex bg-white hover:bg-gray-50 transition-all
              hover:scale-95 shadow-lg border justify-center items-center rounded-xl cursor-pointer"
            onClick={() => seleccionarNave("NAVE-01-LU")}
          >
            <span className="text-blue-500 font-semibold text-xl">Nave 01</span>
          </div>
          <div className="flex w-[900px] m-2 gap-4">
            <div
              className="h-40 w-[600px] bg-white hover:bg-gray-50 transition-all hover:scale-95
                rounded-xl shadow-xl border flex justify-center items-center cursor-pointer"
              onClick={() => seleccionarNave("NAVE-03-LU")}
            >
              <span className="text-blue-500 font-semibold text-xl">Nave 03</span>
            </div>
            <div
              className="bg-white w-[300px] hover:bg-gray-50 transition-all hover:scale-95
                h-[490px] flex justify-center items-center rounded-xl shadow-xl border cursor-pointer"
              onClick={() => seleccionarNave("NAVE-02-LU")}
            >
              <span className="text-blue-500 font-semibold text-xl">Nave 02</span>
            </div>
          </div>
          <div className="border border-b-0 border-gray-400 opacity-50 w-[300px] h-10 p-4 flex justify-center items-center">
            <span className="text-gray-600 font-semibold">Entrada</span>
          </div>
        </div>
      );
    }

    // Nivel 3: Zona seleccionada → ubicaciones
    if (zonaParam) {
      // Zonas aún cargando → esperar antes de renderizar ZonaAlmacen
      if (isLoadingZonas || !zonaActual) {
        return <div className="text-center py-10">Cargando zona...</div>;
      }
      return (
        <div className="w-full h-full flex justify-center p-2 ">
          {viewUbicacion && (
            <ViewUbicacion
              setViewUbicacion={setViewUbicacion}
              ubicacionSeleccionada={ubicacionSeleccionada}
              reload={getUbicaciones}
            />
          )}
          <div className="w-full">

            {isLoadingUbicaciones ? (
              <div className="text-center py-10">Cargando ubicaciones...</div>
            ) : (
              <div
                className="relative grid"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, calc(100vw / ${COLS + 1}))`,
                  gridTemplateRows: `repeat(${ROWS}, calc(100% / ${ROWS}))`,
                  width: "99%",
                  height: "70vh",
                }}
              >
                <ZonaAlmacen
                  zona={zonaActual}
                  ubicaciones={ubicaciones}
                  totalCols={COLS}
                  totalRows={ROWS}
                  onclick={(u) => {
                    setUbicacionSeleccionada(u);
                    setViewUbicacion(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Nivel 2: Nave seleccionada → mapa de zonas
    if (isLoadingZonas) return <div className="p-6">Cargando zonas...</div>;

    return (
      <div
        className="relative grid w-full p-2 justify-center mb-4"
        style={{
          gridTemplateColumns: `repeat(${COLS}, calc(100vw / ${COLS + 1}))`,
          gridTemplateRows: `repeat(${ROWS + 3}, calc(100% / ${ROWS + 3}))`,
          width: "99%",
          height: "75vh",
        }}
      >
        {zonas.map((zona, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center bg-white hover:bg-sky-600
              text-sky-600 hover:!text-white border rounded-lg cursor-pointer
              transition-all hover:scale-95 shadow-md"
            style={{
              gridColumnStart: zona.xInicio,
              gridRowStart: zona.yInicio,
              gridColumnEnd: zona.xInicio + (zona.orientacion === "HORIZONTAL" ? 4 : 2),
              gridRowEnd: zona.yInicio + (zona.orientacion === "HORIZONTAL" ? 2 : 6),
            }}
            onClick={() => seleccionarZona(zona._id)}
          >
            <span className="font-semibold text-sm text-center">{zona.nombre}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mx-4 max-h-screen relative flex justify-center">
        {mostrarAtras && (
          <div
            className="m-2 bg-gradient-to-r px-4 py-2 cursor-pointer transition-all rounded-md
              text-white from-[#abb0b6] to-[#808285] hover:from-[#2b5993] hover:to-[#306fa8]
              left-0 -top-16 z-40 h-10 absolute w-40 flex items-center justify-center gap-3"
            onClick={handleAtras}
          >
            <span className="pi pi-arrow-left" /> Atrás
          </div>
        )}
        {renderContenido()}
      </div>
    </div>
  );
};

export default VistaGeneral;