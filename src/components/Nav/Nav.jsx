import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Options from "../../recicle/Option";
import Logout from "../Logout/Logout";
import SearchBar from "../Nav/SearchBar";
import Notificon from "../../recicle/Buttons/Notification";
import NotificationListener from "../../utils/NotificationListener";
import { useState } from "react";
import SwitchDark from "../../recicle/componentes ui/ModeDark";
const imagen = "https://cdn-icons-png.freepik.com/512/10975/10975953.png";

const Nav = ({ unreadCount }) => {
  console.log("🔔 Nav renderizado con unreadCount:", unreadCount);
  const { user } = useAuth();
  return (
    <div className="flex justify-between ml-20 dark:bg-slate-500 bg-white items-center px-12 h-20  border-b border-b-stone-200">
      {/* <div className=" flex justify-around  items-center  m-2 rounded-lg h-14">
        <img src={imagen} alt="buscador" className="w-10 bg-white h-200" />
        <SearchBar></SearchBar>
      </div> */}
      <div>
        {/* <SwitchDark onChange={(e) => {
          if (e.target.checked) {
            document.body.classList.add("noche");
          } else {
            document.body.classList.remove("noche");
          }
        }} /> */}
      </div>
      {user ? (
        <div className=" flex justify-around items-center m-2  h-1">
          <Link to="/notificaciones">
            <div className="relative bg-slate-200 flex justify-center items-center w-16 m-4 h-16 rounded-full">
              <Notificon />
              {/* 🔥 Usa la prop unreadCount calculada de manera exacta por el servidor */}
              {unreadCount > 0 && (
                <div className="absolute top-0 -right-2 p-[14px] flex justify-center items-center w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold ready-badge">
                  {unreadCount}
                </div>
              )}
            </div>
          </Link>

          <Options
            content={
              <img
                className="rounded-full h-16 w-16 shadow-md shadow-gray-200 active:shadow-inner object-cover object-top"
                src={user.photo}
                alt={user.name?.split(" ")[0] || "foto"}
              />
            }
            children={
              <div className="flex flex-col justify-center items-start">
                <a
                  className="m-2 w-full text-start"
                  href={`/profile?id=${user._id}`}
                >
                  <button>Perfil</button>
                </a>
                <a className="m-2 w-full text-start" href="/settings">
                  <button>Configuración</button>
                </a>
                <Logout></Logout>
              </div>
            }
            classname1="mr-0"
          />
        </div>
      ) : (
        <div>
          <Link to="/">Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default Nav;
