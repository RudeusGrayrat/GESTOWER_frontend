import axios from "../../../api/axios";
import { GET_WIDGETS_PREFERENCE, GET_SUBMODULES } from "./types";

export const getWidgetsPreference = (colaborador) => async (dispatch) => {
  try {
    const response = await axios.get(`/getWidgetsPreference/${colaborador}`);
    const data = response.data;
    dispatch({
      type: GET_WIDGETS_PREFERENCE,
      payload: data,
    });
  } catch (error) {
    throw error;
  }
};

export const getSubModule = () => async (dispatch) => {
  try {
    const response = await axios.get("/getSubModules");
    const data = response.data;
    dispatch({
      type: GET_SUBMODULES,
      payload: data,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllNotificaciones = (_id, typeUser, search = "", date = "", page = 1, limit = 10) => async (dispatch) => {
  try {
    const params = { _id, typeUser, search, date, page, limit };
    const response = await axios.get("/herramientas/getNotificaciones", { params });

    // Recibimos totalUnread desde el controlador
    const { notificaciones, pagination, totalUnread } = response.data;
    console.log("📬 Notificaciones recibidas del servidor:", notificaciones);
    dispatch({
      type: "GET_ALL_NOTIFICACIONES",
      payload: {
        notificaciones,
        pagination,
        unreadCount: totalUnread, // 👈 Guarda esto en tu reducer: state.unreadCount = action.payload.unreadCount
        page
      },
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
  }
};
export const marcarNotificacionLeida = (notificationId, userId) => async (dispatch) => {
  try {
    // Cambia esta ruta por tu endpoint real en Node para actualizar la lectura
    await axios.patch(`/herramientas/notificacionLeida/${notificationId}`, { userId });

    dispatch({
      type: "MARCAR_NOTIFICACION_LEIDA",
      payload: { notificationId, userId }
    });
  } catch (error) {
    console.error("Error al marcar como leída:", error);
    throw error;
  }
};