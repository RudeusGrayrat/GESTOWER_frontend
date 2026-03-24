import { getZonasByParams } from "../../../../../redux/modules/Almacen/actions";
import ZonaAlmacen from "../../../Almacen/Zona";
import { useEffect, useState } from "react";
import axios from "../../../../../api/axios";
import PopUp from "../../../../../recicle/popUps";
import useSendMessage from "../../../../../recicle/senMessage";
import ViewUbicacion from "../ViewUbicacion";

const Nave02 = ({ naveId }) => {
  const [zonas, setZonas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const posicionesByZona = {
    "ZONA-013": { xInicio: 2, yInicio: 65 },
    "ZONA-014": { xInicio: 10, yInicio: 106 },
    "ZONA-015": { xInicio: 12, yInicio: 91 },
    "ZONA-016": { xInicio: 12, yInicio: 76 },
    "ZONA-017": { xInicio: 12, yInicio: 61 },
    "ZONA-018": { xInicio: 12, yInicio: 46 },
    "ZONA-019": { xInicio: 12, yInicio: 31 },
    "ZONA-020": { xInicio: 12, yInicio: 16 },
    "ZONA-021": { xInicio: 12, yInicio: 1 },
    "ZONA-022": { xInicio: 2, yInicio: 1 },
  };
  const asignarUbicacionesByZona = async () => {
    const paramsZonas = {
      almacenId: naveId || "",
    };
    const allZonas = await getZonasByParams(paramsZonas);
    const zonasConUbicaciones = allZonas.map((zona) => {
      const pos = posicionesByZona[zona.nombre];
      return {
        ...zona,
        ...pos,
      };
    });
    setZonas(zonasConUbicaciones);
  };
  const sendMessage = useSendMessage();
  const [isLoadingUbicaciones, setIsLoadingUbicaciones] = useState(true);

  const traerUbicaciones = async () => {
    setIsLoadingUbicaciones(true);
    try {
      const paramsUbicaciones = { almacenId: naveId || "" };
      const params = new URLSearchParams(paramsUbicaciones);
      const response = await axios.get(
        `/getUbicacionByParams?${params.toString()}`
      );
      setUbicaciones(response.data);
    } catch (error) {
      sendMessage(error?.response?.data?.message, "Error");
    } finally {
      setIsLoadingUbicaciones(false);
    }
  };

  useEffect(() => {
    if (naveId) {
      traerUbicaciones();
    }
  }, [naveId]);

  useEffect(() => {
    if (ubicaciones.length > 0) {
      asignarUbicacionesByZona(); // luego las zonas
    }
  }, [ubicaciones]);

  const [viewUbicación, setViewUbicación] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const onclick = (ubicacion) => {
    setViewUbicación(true);
    try {
      //traer todos los estoks de esa ubicacion
      setUbicacionSeleccionada(ubicacion);
    } catch (error) {
      sendMessage(error?.response?.data?.message, "Error");
    }
  };
  return (
    <div className="w-full h-full flex  justify-center bg-gray-100 p-2 rounded-lg shadow-lg">
      {viewUbicación && (
        <ViewUbicacion
          setViewUbicacion={setViewUbicación}
          ubicacionSeleccionada={ubicacionSeleccionada}
        />
      )}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(26, calc(100vw / 30))`,
          gridTemplateRows: `repeat(1010, calc(100% / 115))`,
          width: "99%",
          height: "360vh",
        }}
      >
        {!isLoadingUbicaciones ? (
          zonas.map((zona, idx) => {
            const ubicacionesZona = ubicaciones.filter(
              (u) => String(u.zonaId?._id || u.zonaId) === String(zona._id)
            );
            return (
              <ZonaAlmacen
                key={idx}
                zona={zona}
                ubicaciones={ubicacionesZona}
                onclick={onclick}
              />
            );
          })
        ) : (
          <div>Cargando ubicaciones...</div>
        )}
      </div>
    </div>
  );
};

export default Nave02;
