import { useEffect, useState } from "react";
import useModulesAndSubModules from "../SideBar/Links";
import Atajo from "./ItemWidget";
import { useDispatch, useSelector } from "react-redux";
import { getAllWidgets, getWidgetsPreference } from "../../redux/actions";
import useSendMessage from "../../recicle/senMessage";
import { useAuth } from "../../context/AuthContext";
import PopUp from "../../recicle/popUps";

const WidgetStore = ({ show, colaborador }) => {
  const [mostrar, setMostrar] = useState(false);
  const { links } = useModulesAndSubModules();
  const allWidgets = useSelector((state) => state.herramientas.allWidgets);
  const widgetsPreference = useSelector((state) => state.herramientas.widgetsPreference);
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();
  const { addWidgetPreference } = useAuth();
  useEffect(() => {
    if (allWidgets.length === 0) {
      dispatch(getAllWidgets());
    }
  }, [dispatch, allWidgets]);

  useEffect(() => {
    setMostrar(show);
  }, [show]);
  const options = [
    ...links.map((option) => {
      return option.module;
    }),
  ];
  const [selectedOption, setSelectedOption] = useState();
  const [selects, setSelects] = useState([]);
  const [deshabilitar, setDeshabilitar] = useState(false);

  const onClickOption = (option) => {
    setSelectedOption(option);
    const filteredWidgets = allWidgets.filter(
      (widget) => widget.grupo === option
    );
    setSelects(filteredWidgets);
  };
  const agregarWidget = async (widget) => {
    setDeshabilitar(true);
    sendMessage("Cargando...", "Espere");
    try {
      const data = {
        colaborador: colaborador,
        widget: widget,
        orden: widgetsPreference?.widgets?.length + 1 || 1,
      };

      await addWidgetPreference(data);
    } catch (error) {
      sendMessage(error, "Error");
    } finally {
      setDeshabilitar(false);
    }
  };
  useEffect(() => {
  if (options.length > 0 && !selectedOption && allWidgets.length > 0) {
    const firstOption = options[0];
    setSelectedOption(firstOption);
    const filteredWidgets = allWidgets.filter(
      (widget) => widget.grupo === firstOption
    );
    setSelects(filteredWidgets);
  }
}, [options, allWidgets.length >0]);


  return (
    <div
      className={`border-2 p-3 absolute top-[8%] rounded-[60px] items-center justify-center ite h-[85%] w-[90%] border-gray-100 bg-white shadow-lg flex transition-all duration-300 ${
        mostrar
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 translate-y-5 "
      }`}
    >
      <PopUp deshabilitar={deshabilitar} />
      <div className="flex shadow-lg flex-col py-5 items-center bg-gradient-to-t from-[#ffffff] to-[#ececec3a] rounded-[60px] w-[13%] h-[97%]">
        <div className="flex items-center justify-center rounded-xl mt-10  w-[90%] border-gray-100  shadow-lg  py-4  bg-gradient-to-r from-gray-50 to-gray-100 ">
          <h2 className="text-center text-2xl font-bold ">Store</h2>
        </div>
        <div className="flex py-5 flex-col overflow-y-auto items-center justify-start w-full h-full ">
          {options.map((option, index) => (
            <button
              onClick={() => onClickOption(option)}
              key={index}
              className={`transition-all duration-300 flex py-3 items-center justify-center text-gray-700 rounded-xl my-4 h-12 w-[88%] border-gray-100 shadow-lg ${
                selectedOption === option
                  ? "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-100 scale-105"
                  : "bg-[#fffefe] hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-100 hover:scale-105"
              }`}
            >
              <span className="text-center text-md font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-start items-start overflow-y-scroll w-[85%] shadow-lg bg-gradient-to-r from-[#ffffff] to-[#f1f1f181] rounded-[60px] h-[97%]">
        <div className="grid grid-cols-3 p-10 grid-flow-row w-full h-full">
          {selects.map((option, index) => {
            return (
              <Atajo
                key={index}
                name={option?.name}
                onclick={() => agregarWidget(option._id)}
                draggable
                fondo={option?.imagen}
                style={{
                  padding: "10px",
                  margin: "15px",
                  border: "1px solid #ccc",
                  backgroundImage: `url(${option?.imagen})`,
                  cursor: "grab",
                }}
              ></Atajo>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WidgetStore;
