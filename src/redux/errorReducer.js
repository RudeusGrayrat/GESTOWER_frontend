const initialState = {
  type: "", // Ej: "success", "error", "warning"
  message: "", // El mensaje que se mostrará
  loading: false // Indica si el mensaje es de carga
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return {
        type: action.payload.type,
        message: action.payload.message,
        loading: action.payload.loading 
      };

    case "CLEAR_MESSAGE":
      return {
        type: "",
        message: "",
        loading: false
      };

    default:
      return state;
  }
};

export default errorReducer;
