import { GET_WIDGETS_PREFERENCE, GET_SUBMODULES } from "./types";

const iniTialState = {
  widgetsPreference: [],
  submodules: [],
  allNotificaciones: [],
  pagination: {},
  unreadCount: 0,
};

const herramientasReducer = (state = iniTialState, action) => {
  switch (action.type) {
    case GET_WIDGETS_PREFERENCE:
      return {
        ...state,
        widgetsPreference: action.payload,
      };
    case GET_SUBMODULES:
      return {
        ...state,
        submodules: action.payload,
      };
    case "GET_ALL_NOTIFICACIONES":
      return {
        ...state,
        // Si es la página 1, reemplaza. Si es página > 1, concatena (Cargar más)
        allNotificaciones: action.payload.page === 1
          ? action.payload.notificaciones
          : [...state.allNotificaciones, ...action.payload.notificaciones],
        pagination: action.payload.pagination,
        unreadCount: action.payload.unreadCount,
      };

    case "ADD_REALTIME_NOTIFICATION":
      // Evitamos duplicar notificaciones si por alguna razón ya se encuentra mapeada
      const existe = state.allNotificaciones.some(n => n._id === action.payload._id);
      if (existe) return state;

      return {
        ...state,
        // Agregamos la nueva notificación al inicio de la lista operativa
        allNotificaciones: [action.payload, ...state.allNotificaciones],
        // Incremetamos automáticamente el contador global en caliente 🔥
        unreadCount: state.unreadCount + 1
      };

    case "MARCAR_NOTIFICACION_LEIDA":
      return {
        ...state,
        allNotificaciones: state.allNotificaciones.map((n) => {
          if (n._id !== action.payload.notificationId) return n;
          if (n.type === "INDIVIDUAL") {
            return { ...n, isReadIndividual: true };
          } else {
            const yaLeido = n.readBy?.some(r => (r.userId?._id || r.userId) === action.payload.userId);
            if (!yaLeido) {
              return {
                ...n,
                readBy: [...(n.readBy || []), { userId: action.payload.userId, readAt: new Date() }]
              };
            }
            return n;
          }
        }),
        unreadCount: state.unreadCount - 1  // 🔥 Resta directa
      };

    default:
      return state;
  }
};

export default herramientasReducer;