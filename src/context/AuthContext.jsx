import axios from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "../api/verifyToken";
import { setMessage } from "../redux/actions";
import { useDispatch } from "react-redux";
import {
  create_Contrato,
  delete_Contrato,
  update_Contrato,
} from "./CRUD/Recursos Humanos/Contratos";
import {
  create_Employee,
  update_Employee,
} from "./CRUD/Recursos Humanos/Colaboradores";
import {
  create_plantilla_contrato,
  delete_plantilla_contrato,
  update_plantilla_contrato,
} from "./CRUD/Recursos Humanos/PlantillasContrato";
import {
  create_AsistenciaColaborador,
  delete_AsistenciaColaborador,
  update_AsistenciaColaborador,
} from "./CRUD/Recursos Humanos/AsistenciaColaborador";
import {
  create_AsistenciaVisitante,
  delete_AsistenciaVisitante,
  update_AsistenciaVisitante,
} from "./CRUD/Recursos Humanos/AsistenciaVisitante";
import {
  delete_BoletasDePago,
  enviar_BoletasDePago,
  post_BoletasDePago,
  update_BoletasDePago,
} from "./CRUD/Recursos Humanos/BoletasDePago";
import { create_Certificado } from "./CRUD/Certificaciones/Certificados";
import {
  create_InventarioSistemas,
  delete_InventarioSistemas,
  update_InventarioSistemas,
} from "./CRUD/Sistemas/Inventario";
import {
  add_WidgetPreference,
  create_Widgets,
  delete_Widgets,
  update_WidgetPreference,
  update_Widgets,
} from "./CRUD/Sistemas/Widgets";
import {
  create_Module,
  create_subModule,
  delete_Module,
  delete_subModule,
} from "./CRUD/Herramientas/ModulosYSubmodulos";
import { create_ContratoAlmacen } from "./CRUD/Almacen/Almacen";
import {
  create_SedesAlmacen,
  delete_SedesAlmacen,
  update_SedesAlmacen,
} from "./CRUD/Almacen/Sedes";
import {
  create_MovimientoAlmacen,
  delete_MovimientoAlmacen,
  update_MovimientoAlmacen,
} from "./CRUD/Almacen/Movimientos";
import {
  create_ProductoAlmacen,
  delete_ProductoAlmacen,
  update_ProductoAlmacen,
} from "./CRUD/Almacen/Productos";
import {
  create_NavesAlmacen,
  delete_NavesAlmacen,
  update_NavesAlmacen,
} from "./CRUD/Almacen/Naves";
import {
  create_ZonaAlmacen,
  delete_ZonaAlmacen,
  update_ZonaAlmacen,
} from "./CRUD/Almacen/Zonas";
import {
  create_UbicacionProducto,
  delete_UbicacionProducto,
  update_UbicacionProducto,
} from "./CRUD/Almacen/Ubicacion";
import { delete_StockAlmacen } from "./CRUD/Almacen/Stock";

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [response, setResponse] = useState(null);

  const signin = async (user) => {
    try {
      const response = await axios.post("/login", user);
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_expiry", Date.now() + 24 * 60 * 60 * 1000);
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const signup = async (employee) => {
    await create_Employee(employee, setResponse, setErrors);
  };
  const updateEmployee = async (employee) => {
    await update_Employee({ ...employee, actualizadoPor: user._id }, setResponse, setErrors);
  };

  const createClient = async (user) => {
    try {
      const response = await axios.post("/createClient", user);
      const data = response.data;
      setResponse(data.message);
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const updateClient = async (user) => {
    try {
      const response = await axios.patch("/patchClient", user);
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const deleteClient = async (id) => {
    try {
      const response = await axios.delete("/deleteClient", {
        data: { _id: id },
      });
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };

  const createCotizacion = async (user) => {
    try {
      const response = await axios.post("/createCotizacion", user);
      const data = response.data;
      setResponse(data.cotizacion.correlativa);
    } catch (error) {
      setErrors(
        error?.response?.data?.message?._message ||
        error?.response?.data?.message
      );
    }
  };

  const deleteCotizacion = async (id) => {
    try {
      const response = await axios.delete("/deleteCotizacion", {
        data: { _id: id },
      });
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const patchCotizacion = async (user) => {
    try {
      const response = await axios.patch("/patchCotizacion", user);
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const postBusiness = async (user) => {
    try {
      const response = await axios.post("/createBusiness", user);
      const data = response.data;
      setResponse(data.message);
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const deleteBusiness = async (id) => {
    try {
      const response = await axios.delete("/deleteBusiness", {
        data: { _id: id },
      });
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };

  const updateBusiness = async (user) => {
    try {
      const response = await axios.patch("/patchBusiness", user);
      const data = response.data;
      setResponse(data.message);
      return data;
    } catch (error) {
      setErrors(error?.response?.data?.message);
    }
  };
  const createContrato = async (contract) => {
    await create_Contrato(contract, setErrors, setResponse);
  };
  const updateContrato = async (contract) => {
    await update_Contrato(contract, setErrors, setResponse);
  };
  const deleteContrato = async (id) => {
    await delete_Contrato(id, setErrors, setResponse);
  };

  const createPlantillaContrato = async (plantilla_contrato) => {
    await create_plantilla_contrato(plantilla_contrato, setResponse, setErrors);
  };
  const updatePlantillaContrato = async (plantilla_contrato) => {
    await update_plantilla_contrato(plantilla_contrato, setResponse, setErrors);
  };
  const deletePlantillaContrato = async (id) => {
    await delete_plantilla_contrato(id, setResponse, setErrors);
  };

  const createAsistenciaColaborador = async (AsistenciaColaborador) => {
    await create_AsistenciaColaborador(
      AsistenciaColaborador,
      setResponse,
      setErrors
    );
  };
  const updateAsistenciaColaborador = async (AsistenciaColaborador) => {
    await update_AsistenciaColaborador(
      AsistenciaColaborador,
      setResponse,
      setErrors
    );
  };
  const deleteAsistenciaColaborador = async (id) => {
    await delete_AsistenciaColaborador(id, setResponse, setErrors);
  };

  const createAsistenciaVisitante = async (AsistenciaVisitante) => {
    await create_AsistenciaVisitante(
      AsistenciaVisitante,
      setResponse,
      setErrors
    );
  };
  const updateAsistenciaVisitante = async (AsistenciaVisitante) => {
    await update_AsistenciaVisitante(
      AsistenciaVisitante,
      setResponse,
      setErrors
    );
  };
  const deleteAsistenciaVisitante = async (id) => {
    await delete_AsistenciaVisitante(id, setResponse, setErrors);
  };

  const postBoletasDePago = async (BoletasDePago) => {
    await post_BoletasDePago(BoletasDePago, setResponse, setErrors);
  };
  const updateBoletasDePago = async (BoletasDePago) => {
    await update_BoletasDePago(BoletasDePago, setResponse, setErrors);
  };
  const deleteBoletasDePago = async (id) => {
    await delete_BoletasDePago(id, setResponse, setErrors);
  };
  const enviarBoletasDePago = async (BoletasDePago) => {
    await enviar_BoletasDePago(BoletasDePago, setResponse, setErrors);
  };
  const enviarCertificados = async (certificados) => {
    await create_Certificado(certificados, setResponse, setErrors);
  };

  const postInventarioSistemas = async (InventarioSistemas) => {
    await create_InventarioSistemas(InventarioSistemas, setResponse, setErrors);
  };
  const patchInventarioSistemas = async (InventarioSistemas) => {
    await update_InventarioSistemas(InventarioSistemas, setResponse, setErrors);
  };
  const deleteInventarioSistemas = async (id) => {
    await delete_InventarioSistemas(id, setResponse, setErrors);
  };
  const postWidget = async (widget) => {
    await create_Widgets(widget, setResponse, setErrors);
  };
  const patchWidget = async (widget) => {
    await update_Widgets(widget, setResponse, setErrors);
  };
  const deleteWidget = async (id) => {
    await delete_Widgets(id, setResponse, setErrors);
  };
  const addWidgetPreference = async (widget) => {
    await add_WidgetPreference(widget, setResponse, setErrors);
  };
  const updateWidgetPreference = async (widget) => {
    await update_WidgetPreference(widget, setResponse, setErrors);
  };
  const postModule = async (module) => {
    await create_Module(module, setResponse, setErrors);
  };
  const deleteModule = async (id) => {
    await delete_Module(id, setResponse, setErrors);
  };
  const postSubModule = async (submodule) => {
    await create_subModule(submodule, setResponse, setErrors);
  };
  const deleteSubModule = async (id) => {
    await delete_subModule(id, setResponse, setErrors);
  };
  const postContratoAlmacen = async (ContratoAlmacen) => {
    await create_ContratoAlmacen(ContratoAlmacen, setResponse, setErrors);
  };
  const postSedesAlmacen = async (SedesAlmacen) => {
    await create_SedesAlmacen(SedesAlmacen, setResponse, setErrors);
  };
  const patchSedesAlmacen = async (SedesAlmacen) => {
    await update_SedesAlmacen(SedesAlmacen, setResponse, setErrors);
  };
  const deleteSedesAlmacen = async (id) => {
    await delete_SedesAlmacen(id, setResponse, setErrors);
  };
  const postMovimientoAlmacen = async (MovimientoAlmacen) => {
    await create_MovimientoAlmacen(MovimientoAlmacen, setResponse, setErrors);
  };
  const deleteMovimientoAlmacen = async (id) => {
    await delete_MovimientoAlmacen(id, setResponse, setErrors);
  };
  const patchMovimientoAlmacen = async (MovimientoAlmacen) => {
    await update_MovimientoAlmacen(MovimientoAlmacen, setResponse, setErrors);
  };
  const postProductosAlmacen = async (ProductoAlmacen) => {
    await create_ProductoAlmacen(ProductoAlmacen, setResponse, setErrors);
  };
  const patchProductosAlmacen = async (ProductoAlmacen) => {
    await update_ProductoAlmacen(ProductoAlmacen, setResponse, setErrors);
  };
  const deleteProductosAlmacen = async (id) => {
    await delete_ProductoAlmacen(id, setResponse, setErrors);
  };
  const postNavesAlmacen = async (NavesAlmacen) => {
    await create_NavesAlmacen(NavesAlmacen, setResponse, setErrors);
  };
  const patchNavesAlmacen = async (NavesAlmacen) => {
    await update_NavesAlmacen(NavesAlmacen, setResponse, setErrors);
  };
  const deleteNavesAlmacen = async (id) => {
    await delete_NavesAlmacen(id, setResponse, setErrors);
  };
  const postZonaAlmacen = async (ZonaAlmacen) => {
    await create_ZonaAlmacen(ZonaAlmacen, setResponse, setErrors);
  };
  const patchZonaAlmacen = async (ZonaAlmacen) => {
    await update_ZonaAlmacen(ZonaAlmacen, setResponse, setErrors);
  };
  const deleteZonaAlmacen = async (id) => {
    await delete_ZonaAlmacen(id, setResponse, setErrors);
  };
  const postUbicacionProducto = async (ubicacion) => {
    await create_UbicacionProducto(ubicacion, setResponse, setErrors);
  };
  const patchUbicacionProducto = async (ubicacion) => {
    await update_UbicacionProducto(ubicacion, setResponse, setErrors);
  };
  const deleteUbicacionProducto = async (id) => {
    await delete_UbicacionProducto(id, setResponse, setErrors);
  };
  const deleteStockAlmacen = async (id) => {
    await delete_StockAlmacen(id, setResponse, setErrors);
  };

  useEffect(() => {
    if (errors) {
      dispatch(setMessage(errors, "Error"));
    }
    if (response) {
      dispatch(setMessage(response, "Bien"));
    }
  }, [errors, response]);

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");
      if (expiry && Date.now() > expiry) {
        logout();
      }
      if (token) {
        try {
          const response = await verifyToken(token);
          if (
            response?.response?.data?.message === "No se encuentra este usuario"
          ) {
            await logout();
          }
          if (response?.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          if (error?.response?.data?.message === "Token expirado") {
            setErrors("Token expirado");
            await logout();
          }
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        updateEmployee,
        signin,
        isAuthenticated,
        isLoading,
        logout,
        errors,
        setErrors,
        response,
        setResponse,
        createClient,
        updateClient,
        deleteClient,
        createCotizacion,
        deleteCotizacion,
        patchCotizacion,
        postBusiness,
        deleteBusiness,
        updateBusiness,
        createContrato,
        updateContrato,
        deleteContrato,
        createPlantillaContrato,
        updatePlantillaContrato,
        deletePlantillaContrato,
        createAsistenciaColaborador,
        updateAsistenciaColaborador,
        deleteAsistenciaColaborador,
        createAsistenciaVisitante,
        updateAsistenciaVisitante,
        deleteAsistenciaVisitante,
        postBoletasDePago,
        updateBoletasDePago,
        deleteBoletasDePago,
        enviarBoletasDePago,
        enviarCertificados,
        postInventarioSistemas,
        patchInventarioSistemas,
        deleteInventarioSistemas,
        postWidget,
        patchWidget,
        deleteWidget,
        addWidgetPreference,
        updateWidgetPreference,
        postModule,
        deleteModule,
        postSubModule,
        deleteSubModule,
        postContratoAlmacen,
        postSedesAlmacen,
        patchSedesAlmacen,
        deleteSedesAlmacen,
        postMovimientoAlmacen,
        deleteMovimientoAlmacen,
        patchMovimientoAlmacen,
        postProductosAlmacen,
        patchProductosAlmacen,
        deleteProductosAlmacen,
        postNavesAlmacen,
        patchNavesAlmacen,
        deleteNavesAlmacen,
        postZonaAlmacen,
        patchZonaAlmacen,
        deleteZonaAlmacen,
        postUbicacionProducto,
        patchUbicacionProducto,
        deleteUbicacionProducto,
        deleteStockAlmacen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
