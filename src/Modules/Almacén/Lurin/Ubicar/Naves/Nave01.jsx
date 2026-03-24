import { getZonasByParams } from "../../../../../redux/modules/Almacen/actions";
import ZonaAlmacen from "../../../Almacen/Zona";
import { useEffect, useState } from "react";
import axios from "../../../../../api/axios";
import PopUp from "../../../../../recicle/popUps";
import useSendMessage from "../../../../../recicle/senMessage";
import ViewUbicacion from "../ViewUbicacion";

const Nave01 = ({ naveId }) => {
  const [zonas, setZonas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const posicionesByZona = {
    "ZONA-001": { xInicio: 22, yInicio: 47 },
    "ZONA-002": { xInicio: 40, yInicio: 11 },
    "ZONA-003": { xInicio: 22, yInicio: 1 },
    "ZONA-004": { xInicio: 8, yInicio: 1 },
    "ZONA-005": { xInicio: 1, yInicio: 17 },
    "ZONA-006": { xInicio: 8, yInicio: 47 },
    "ZONA-007": { xInicio: 8, yInicio: 34 },
    "ZONA-008": { xInicio: 22, yInicio: 34 },
    "ZONA-009": { xInicio: 8, yInicio: 21 },
    "ZONA-010": { xInicio: 22, yInicio: 21 },
    "ZONA-011": { xInicio: 9, yInicio: 8 },
    "ZONA-012": { xInicio: 22, yInicio: 8 },
  };
  const asignarUbicacionesByZona = async () => {
    const paramsZonas = {
      almacenId: naveId || "",
    };
    const allZonas = await getZonasByParams(paramsZonas);
    const zonasConUbicaciones = allZonas.map((zona) => {
      const pos = posicionesByZona[zona.nombre] || { xInicio: 1, yInicio: 1 };
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
      traerUbicaciones(); // primero las ubicaciones
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
          gridTemplateColumns: `repeat(46, calc(100vw / 52))`,
          gridTemplateRows: `repeat(52, calc(100% / 55))`,
          width: "99%",
          height: "150vh",
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

export default Nave01;
