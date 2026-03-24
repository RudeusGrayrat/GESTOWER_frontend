import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import useSendMessage from "../../../../recicle/senMessage";
import DatosBasicos from "./DatosBasicos";
import RacksPorZona from "./Racks";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd copy";
import { useDispatch, useSelector } from "react-redux";
import { getAllNavesAlmacen } from "../../../../redux/modules/Almacen/actions";
import axios from "../../../../api/axios";

const RegisterZonas = () => {
  const [habilitar, setHabilitar] = useState(false);
  const allNaves = useSelector((state) => state.almacen.allNaves);
  const naves = allNaves.map((nave) => nave.nombre);
  const dispatch = useDispatch();
  const recargar = () => {
    dispatch(getAllNavesAlmacen());
  };
  const [form, setForm] = useState({
    nombre: "",
    almacen: "",
    orientacion: "",
    rackPorZona: "",
    racks: [
      {
        nombre: "",
        niveles: "",
        seccionesPorNivel: "",
      },
    ],
  });
  // const { error, validateForm } = useValidation();
  const { postUbicacionProducto, user } = useAuth();
  const sendMessage = useSendMessage();
  const enviar = async () => {
    // const isValid = validateForm(form);
    setHabilitar(true);
    sendMessage("Registrando zona...", "Espere", true);
    // if (!isValid) {
    //   sendMessage("Faltan datos", "Error");
    //   return;
    // }
    try {
      const almacenId = allNaves.find(
        (nave) => nave.nombre === form.almacen
      )?._id;

      const response = await axios.post("/postZonaAlmacen", {
        ...form,
        almacenId,
      });
      const zonaId = response.data.zona._id;
      if (!zonaId) {
        throw new Error("Error al crear la zona de almacen");
      }
      await postUbicacionProducto({
        zonaId: zonaId,
        porcentaje: 0,
        estado: "LIBRE",
        creadoPor: user._id,
        racks: form.racks,
      });

      sendMessage("Zona de Almacen creada correctamente", "Success");
    } catch (error) {
      sendMessage(
        error.response.data.message || error.message || error,
        "Error"
      );
    } finally {
      setHabilitar(false);
    }
  };
  const [resetKey, setResetKey] = useState(0);

  const resetForm = () => {
    setForm({
      nombre: "",
      almacen: "",
      orientacion: "",
      rackPorZona: "",
      racks: [
        {
          nombre: "",
          niveles: "",
          seccionesPorNivel: "",
        },
      ],
    });
    setResetKey((prev) => prev + 1); // cambia el valor y fuerza re-render
  };

  useEffect(() => {
    if (allNaves.length === 0) {
      recargar();
    }
  }, [allNaves.length, recargar]);
  return (
    <div className="flex flex-col w-full p-6">

      <CardPlegable title="Registrar Zona de Almacen">
        <DatosBasicos form={form} naves={naves} setForm={setForm} />
      </CardPlegable>
      <CardPlegable title="Registrar Zona de Almacen">
        <Directorio
          ItemComponent={RacksPorZona}
          data="racks"
          estilos=" flex justify-center items-center"
          directory={form.racks}
          setForm={setForm}
          resetForm={resetKey}
          // error={error}
        />
      </CardPlegable>
      <div className="flex justify-center ">
        <ButtonOk
          type="ok"
          onClick={enviar}
          classe="!w-32"
          children="Registrar"
        />
        <ButtonOk
          children="Cancelar"
          classe="!w-32"
          onClick={() => resetForm()}
        />
      </div>
    </div>
  );
};

export default RegisterZonas;
