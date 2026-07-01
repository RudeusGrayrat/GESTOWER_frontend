import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotificaciones, marcarNotificacionLeida } from "../../../redux/modules/Herramientas/actions";
import { useAuth } from "../../../context/AuthContext";
import "../../Principal/List/stylePrueba.css";

const Badge = ({ type }) => {
  const styles = {
    GLOBAL: " text-purple-700 border-purple-100",
    SUBMODULE: "text-blue-700 border-blue-100",
    INDIVIDUAL: "bg-green-50 text-green-700 border-green-100",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-lg border ${styles[type] || " text-gray-700"}`}>
      {type}
    </span>
  );
};

const Notificaciones = () => {
  const notificaciones = useSelector((state) => state.herramientas.allNotificaciones) || [];
  const pagination = useSelector((state) => state.herramientas?.pagination) || {};
  const { user } = useAuth();
  const dispatch = useDispatch();

  // ⚙️ ESTADOS LOCALES
  const [selectedId, setSelectedId] = useState(null);
  const [exitingIds, setExitingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // 🔥 NUEVO: Estado para almacenar la fecha YYYY-MM-DD
  const [page, setPage] = useState(1);

  // 🔄 Cargar las notificaciones por página y por filtros activos
  useEffect(() => {
    if (user?._id) {
      const userType = "Employee"; // O "UserExternal" según corresponda
      // Pasamos tanto el buscador de texto como el filtro de fecha real al backend
      dispatch(getAllNotificaciones(user._id, userType, searchTerm, selectedDate, page, 10));
    }
  }, [dispatch, user, searchTerm, selectedDate, page]);

  // Manejadores controlados para forzar el reinicio de la página a 1 al cambiar filtros
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setPage(1);
  };

  // 🧠 PROCESADOR Y FILTRADO INMUTABLE
  const filteredNotes = useMemo(() => {
    return notificaciones.map((n) => {
      const yaLeido = n.type === "INDIVIDUAL"
        ? n.isReadIndividual
        : n.readBy?.some(read => (read.userId?._id || read.userId) === user?._id);

      const dateFormatted = n.createdAt
        ? new Date(n.createdAt).toLocaleDateString("es-ES", { hour: "2-digit", minute: "2-digit" })
        : "Reciente";

      return {
        id: n._id,
        title: n.title || "",
        message: n.message || "",
        type: n.type,
        entity: n.type === "SUBMODULE" ? "ERP" : "SISTEMA",
        time: dateFormatted,
        read: yaLeido || false,
        isExiting: exitingIds.includes(n._id),
      };
    });
    // Quitamos el .filter() manual del front ya que el backend se encargará de forma óptima de la búsqueda real
  }, [notificaciones, user?._id, exitingIds]);

  // 🛠️ ACCIONES
  const markRead = (id) => {
    if (user?._id) {
      dispatch(marcarNotificacionLeida(id, user._id));
    }
  };

  const remove = (id) => {
    setExitingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setExitingIds((prev) => prev.filter((exId) => exId !== id));
    }, 300);
  };
  const marcarLeido = (n) => {
    setSelectedId(selectedId === n.id ? null : n.id);
    if (!n.read) markRead(n.id); // ✅ solo actúa si no está leída
  };
  return (
    <div className="ml-20 px-6 mt-8 overflow-auto">

      {/* CABECERA */}
      <div className="flex flex-col px-2 items-start gap-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h2>
        <p className="text-sm text-gray-500">Recuerda que las notificaciones se eliminan automáticamente después de 60 días</p>
      </div>

      {/* FILTROS INTERACTIVOS (Buscador + Selector de Fecha) */}
      <div className="flex flex-wrap px-2 items-center gap-4 mb-4 max-w-2xl">
        {/* Input de búsqueda por texto */}
        <div className="relative flex-1 min-w-[260px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <i className="pi pi-search"></i>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por título o contenido..."
            className="w-full p-2.5 pl-10 rounded-xl text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50"
          />
        </div>

        {/* 🔥 NUEVO: Input de Fecha Interactivo */}
        <div className="relative shrink-0">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="p-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50 text-gray-700 font-medium cursor-pointer"
          />
        </div>

        {/* Botón de Limpieza rápido si hay filtros activos */}
        {(searchTerm || selectedDate) && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* FEED DE NOTIFICACIONES */}
      <div className="overflow-hidden">
        <ul className="gap-4 flex flex-col p-2">
          {filteredNotes.map((n) => (
            <li
              key={n.id}
              onClick={() => marcarLeido(n)}
              className={`flex flex-col md:flex-row gap-4 p-5 border border-gray-100 shadow-sm items-center rounded-xl hover:bg-gray-100/50 hover:shadow-lg cursor-pointer transition-all duration-300 ${n.read ? "bg-white opacity-90" : "bg-white border-l-4 border-l-blue-500 shadow-md font-medium"
                } ${n.isExiting ? "opacity-0 translate-x-8 max-h-0 !p-0 !my-0 overflow-hidden border-none shadow-none" : "max-h-[500px]"
                }`}
            >
              <div className="flex-1 h-full w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 ">
                    <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 transition-colors duration-300 ${n.read ? "bg-gray-300" : "bg-blue-500 animate-pulse"}`}
                    />
                    <div className="text-base text-gray-900 flex items-center gap-2">
                      {n.title}
                      <span className="text-xs font-normal text-gray-400">• {n.entity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge type={n.type} />
                    <div className="text-xs text-gray-800 whitespace-nowrap">{n.time}</div>
                    <div className="flex gap-2 self-end md:self-center shrink-0 w-full md:w-auto justify-end border-t md:border-none pt-3 md:pt-0 mt-2 md:mt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(n.id);
                        }}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 font-medium border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`grid transition-all duration-300 ease-in-out ${selectedId === n.id ? "grid-rows-[1fr] opacity100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="p-4  rounded-lg border border-gray-300/60 text-sm text-gray-700 leading-relaxed shadow-inner">
                      <span className="font-semibold block text-gray-900 mb-1">Descripción Completa:</span>
                      {n.message}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}

          {/* ESTADO VACÍO */}
          {filteredNotes.length === 0 && (
            <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-3xl mb-2">🔍</span>
              <div className="font-semibold text-gray-800 text-base">Sin resultados</div>
              <div className="text-sm text-gray-500 mt-0.5">No hay notificaciones para los filtros seleccionados.</div>
            </div>
          )}
        </ul>
      </div>

      {/* 📑 BOTÓN CARGAR MÁS */}
      {pagination.hasNextPage && (
        <div className="flex justify-center mt-6 mb-12">
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <i className="pi pi-plus text-[10px]"></i> Cargar más notificaciones
          </button>
        </div>
      )}

    </div>
  );
};

export default Notificaciones;