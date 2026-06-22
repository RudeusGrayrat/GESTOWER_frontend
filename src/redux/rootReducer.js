import { combineReducers } from "redux";
import almacenReducer from "./modules/Almacen/reducer";
import recursosHumanosReducer from "./modules/Recursos Humanos/reducer";
import errorReducer from "./errorReducer";
import herramientasReducer from "./modules/Herramientas/reducer";
import sistemasReducer from "./modules/Sistemas/reducer";

const rootReducer = combineReducers({
  sistemas: sistemasReducer,
  almacen: almacenReducer,
  recursosHumanos: recursosHumanosReducer,
  // comercial: comercialReducer,
  herramientas: herramientasReducer,
  // certificacion: certificacionReducer,
  error: errorReducer,
});

export default rootReducer;
