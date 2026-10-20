import axios from "axios";
const urlServer = import.meta.env.VITE_SERVER_URL
const instance = axios.create({
  baseURL: urlServer,
  withCredentials: true,
});

// La sesión interna se conserva como JWT en localStorage. Adjuntarlo aquí evita
// que cada formulario tenga que reconstruir manualmente el encabezado autenticado.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
