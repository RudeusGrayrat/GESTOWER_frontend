import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense, useEffect, useState } from "react";
import store from "./redux/store";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import Error from "./components/Error/Error";
import Notificaciones from "./components/Nav/Notificaciones/Noficaciones";
import socket from "./api/socket";

const Home = lazy(() => import("./components/Home/Home"));

const SideBar = lazy(() => import("./components/SideBar/SideBar"));
const Nav = lazy(() => import("./components/Nav/Nav"));
const OtherProfiles = lazy(() => import("./components/Perfil/OtherProfiles"));
const Settings = lazy(() => import("./components/Nav/Configuracion/Settings"));
const Title = lazy(() => import("./components/Home/Title"));
const Novedades = lazy(() =>
  import("./components/Widgets/Novedades/Novedades")
);
const Notas = lazy(() => import("./components/Widgets/Tareas/Notas"));

function App() {
  const location = useLocation();
  const path = ["/asistencia", "/"].includes(location.pathname);

  const [notifications, setNotifications] = useState([]);

  // // Manejar nuevas notificaciones
  // useEffect(() => {
  //   socket.on("notification", (data) => {
  //     console.log("Notificación recibida:", data);
  //     setNotifications((prev) => [data.payload, ...prev]); // Agregar la nueva notificación
  //   });

  //   // Limpiar el evento al desmontar el componente
  //   return () => {
  //     socket.off("notification");
  //   };
  // }, []);
  return (
    <AuthProvider>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <div>
            {!path && <SideBar />}
            {!path && <Nav notifications={notifications} />}

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/*" element={<Error />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/:module/:submodule" element={<Title />} />
                <Route path="/profile" element={<OtherProfiles />} />
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notas" element={<Notas />} />
              </Route>
            </Routes>
          </div>
        </Suspense>
      </Provider>
    </AuthProvider>
  );
}

export default App;
