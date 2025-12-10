import { io } from "socket.io-client";
import "react";

// Obtén la URL del servidor de las variables de entorno
const urlServer = import.meta.env.VITE_SERVER_URL;
const socket =" io(urlServer, {"
// // Crear la conexión de socket
// const socket = io(urlServer, {
//   withCredentials: true, // Si estás usando cookies o credenciales
//   transports: ["websocket"], // Preferir WebSocket como transporte
// });

// // // Emitir el evento de "join" para registrar al usuario en la sala correspondiente
// // if (user) {
// //   socket.emit("join", user._id); // Se le dice al servidor quién es el usuario
// // }

// // Escuchar mensajes o notificaciones desde el servidor
// socket.on("notification", (data) => {
//   console.log("Notificación recibida:", data);
//   // Aquí puedes agregar lógica para manejar las notificaciones
// });

export default socket;
