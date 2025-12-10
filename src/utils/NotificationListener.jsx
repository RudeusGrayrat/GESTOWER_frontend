import { useEffect } from "react";
import socket from "../api/socket";

export default function NotificationListener({ userId, onNewNotification }) {
  // useEffect(() => {
  //   if (!userId) return;

  //   socket.emit("join", userId); // Le dice al backend quién es

  //   socket.on("new_notification", (data) => {
  //     console.log("📩 Nueva notificación:", data);
  //     onNewNotification(data); // Notifica al componente padre
  //   });

  //   return () => {
  //     socket.off("new_notification");
  //   };
  // }, [userId]);

  return null;
}
