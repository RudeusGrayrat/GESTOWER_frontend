import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PopUp from "../../recicle/popUps";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import useSendMessage from "../../recicle/senMessage";
import styles from "./Login.module.css";
import ButtonDiagonal from "../../recicle/Buttons/ButtonDiagonal";

const Login = () => {
  const navigate = useNavigate();
  const [deshabilitar, setDeshabilitar] = useState(false);
  const { signin, isAuthenticated, errors, setErrors } = useAuth();
  const sendMessage = useSendMessage();
  const errorForms = useSelector((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      const lastRoute = localStorage.getItem("lastRoute") || "/home";
      localStorage.removeItem("lastRoute"); // Limpiamos el localStorage después de usarlo
      navigate(lastRoute);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setDeshabilitar(true);
    sendMessage("Cargando...", "Espere");
    try {
      await signin(data);
      if (errors) {
        sendMessage(errors, "Error");
        return setErrors(null);
      }
    } catch (error) {
      sendMessage("Error al iniciar sesión", "Error");
    } finally {
      setDeshabilitar(false);
      sendMessage("", "");
    }
  };

  return (
    <div className="min-h-screen h-screen flex justify-center items-center w-screen"
      style={{
        backgroundImage: "url('GESTOWER_FONDO.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "center",
        backgroundPositionX: "center",
      }}
    >
      <PopUp deshabilitar={deshabilitar} />
      <div
        className="flex rounded-3xl flex-col max-lg:w-[90%]  items-center h-[95%] w-[40%] shadow-lg overflow-hidden">
        <div
          className="w-full h-[50%] relative items-center flex justify-center"
          style={{
            backgroundImage: "url('GESTOWER_FONDO.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div
            className="w-[75%] absolute -bottom-2 z-50 h-[15%] mt-4"
            style={{
              backgroundImage: "url('GESTOWER_NAME.svg')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom",
            }}
          />
        </div>
        <div className=" w-full max-sm:w-[120%]   flex flex-col items-center h-[60%] justify-evenly"
          style={{
            backgroundColor: "rgba(44, 61, 79, 0.7)",
            backdropFilter: "blur(5px) saturate(120%)",
            WebkitBackdropFilter: "blur(5px) saturate(120%)",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col justify-center gap-7 max-md:gap-3 max-sm:text-sm h-full items-center w-full"
          >
            <h2 style={{
              fontFamily: "'Exo', sans-serif",
              fontWeight: 700,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }} className="text-4xl font-bold  text-gray-50 text-center">
              Iniciar sesión
            </h2>
            <div className="max-sm:w-[60%] w-[50%]">
              <label htmlFor="email" className="block text-sm text-white mb-1">
                Correo electrónico
              </label>

              <div className="relative">
                <span>
                  <img
                    src="/ICON-LOGIN-1.png"
                    alt="Icon"
                    className="absolute m-2 inset-y-0 left-0 h-5 flex items-center pl-3"
                  />
                </span>
                <input
                  placeholder="USUARIO"
                  type="email"
                  style={{ backgroundColor: "#1f2937", borderColor: "#7f8c8d" }}
                  className={
                    styles.input +
                    `mt-1 pl-12 block text-white w-full px-3 py-2 border rounded-3xl shadow-sm sm:text-sm ${formErrors.email ? "border-red-500" : "[]"
                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`
                  }
                  {...register("email", {
                    required: "El correo electrónico es requerido",
                  })}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email.message}
                  </p>
                )}
              </div>
            </div>


            <div className="max-sm:w-[60%] w-[50%]">
              <label htmlFor="password" className="block  text-sm text-white mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span>
                  <img
                    src="/ICON-LOGIN-2.png"
                    alt="Icon"
                    className="absolute top-1/2 -translate-y-1/2 h-5 flex items-center left-4"
                  />
                </span>
                <input
                  placeholder="CONTRASEÑA"
                  type="password"
                  style={{
                    backgroundColor: "#1f2937",
                    borderColor: "#7f8c8d",
                  }}
                  className={`mt-1 pl-12 bg-slate-800 block w-full px-3 py-2 border rounded-3xl shadow-sm sm:text-sm ${formErrors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none text-white focus:ring-indigo-500 focus:border-indigo-500`}
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className=" justify-center w-40 mt-4 h-11 rounded-2xl px-3 !py-0.5 text-sm font-semibold leading-6 text-white bg-[#1976c2] hover:scale-105 transition-all
                "
              >
                INICIAR SESIÓN
              </button>
              {/* <ButtonDiagonal text={"INICIAR SESIÓN"} color={"#1976c2"} /> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
