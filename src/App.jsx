import { Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { lazy, Suspense, useEffect, useRef } from "react";
import store from "./redux/store";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import Error from "./components/Error/Error";
import Notificaciones from "./components/Nav/Notificaciones/Noficaciones";
import socket from "./api/socket";
import { getAllNotificaciones } from "./redux/modules/Herramientas/actions";
import { Toast } from "primereact/toast";

// COMPONENTES CARGADOS PEREZOSAMENTE (Sin alteraciones)
const Home = lazy(() => import("./components/Home/Home"));
const SideBar = lazy(() => import("./components/SideBar/SideBar"));
const Nav = lazy(() => import("./components/Nav/Nav"));
const OtherProfiles = lazy(() => import("./components/Perfil/OtherProfiles"));
const Settings = lazy(() => import("./components/Nav/Configuracion/Settings"));
const Title = lazy(() => import("./components/Home/Title"));
const Novedades = lazy(() => import("./components/Widgets/Novedades/Novedades"));
const Notas = lazy(() => import("./components/Widgets/Tareas/Notas"));

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useRef(null);
  const { user } = useAuth();

  const path = ["/asistencia", "/"].includes(location.pathname);

  // 1. Carga inicial de notificaciones (trae las que ya están en BD)
  useEffect(() => {
    if (user?._id) {
      const userType = "Employee";
      dispatch(getAllNotificaciones(user._id, userType, "", "", 1, 10));
    }
  }, [dispatch, user]);

  // 2. Registro en salas de socket (incluye reconexión automática)
  useEffect(() => {
    const registrarEnSalas = () => {
      if (user?._id) {
        const userType = "Employee";
        const misSubmodulos = (user.modules || [])
          .filter(m => m.submodule && m.submodule.name)
          .map(m => m.submodule.name.toUpperCase());

        socket.emit("register_session", {
          userId: user._id,
          userType,
          submodules: misSubmodulos.length > 0 ? misSubmodulos : ["COLABORADORES"],
        });
      }
    };

    socket.on("connect", registrarEnSalas);
    if (socket.connected) registrarEnSalas();

    return () => {
      socket.off("connect", registrarEnSalas);
    };
  }, [user]);

  // 3. Listener de notificaciones en tiempo real (con toast)
  useEffect(() => {
    const handleIncomingNotification = (data) => {
      dispatch({ type: "ADD_REALTIME_NOTIFICATION", payload: data });
      toast.current?.show({
        severity: 'info',
        summary: data.title,
        // detail: data.message,
        life: 6000
      });
      if (Notification.permission === "granted") {
        new Notification(data.title, { body: data.message });
      }
    };

    socket.on("nuevaNotificacion", handleIncomingNotification);
    Notification.requestPermission();

    return () => {
      socket.off("nuevaNotificacion", handleIncomingNotification);
    };
  }, [dispatch])

  const unreadCount = useSelector((state) => state.herramientas.unreadCount || 0);

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      {!path && <SideBar />}
      {!path && <Nav unreadCount={unreadCount} />}

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
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <AppContent />
        </Suspense>
      </AuthProvider>
    </Provider>
  );
}

export default App;