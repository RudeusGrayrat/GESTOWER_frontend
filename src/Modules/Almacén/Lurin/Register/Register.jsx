import { useEffect, useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import DatosGenerales from "./DatosGenerales";
import DescripcionDeBienes from "./DescripcionDeBienes";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import Otros from "./Otros";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import { useAuth } from "../../../../context/AuthContext";
import useValidation from "./Validate";
import axios from "../../../../api/axios";

const RegisterLurin = ({ contratos, contratos_id }) => {
  const sendMessage = useSendMessage();
  const { user } = useAuth();

  const [initialform] = useState({
    movimiento: "INGRESO",
    contrato: "",
    numeroDeActa: "",
    contribuyente: "",
    numeroDocumento: "",
    descripcionBienes: [
      {
        item: 1,
        descripcion: "",
        unidadDeMedida: "UNIDAD",
        cantidadIngresada: "", // Unificado con el Backend
        cantidadDisponible: "", // Unificado con el Backend
        pesoNeto: "",
        pesoBruto: "",
        estadoEnvase: "",
        subItem: "",
        observaciones: "",
      },
    ],
    datosGenerales: {
      fecha: "",
      horaIngreso: "",
      recepcionadoPor: "",
      dniRecepcionadoPor: "",
      responsableEntrega: "",
      registroOCIP: "",
      estadoActa: "",
    },
    horaSalida: "",
    fechaSalida: "",
    detallesDePeso: "",
    referenciaImagen: "",
    observaciones: "",
    codigoIngreso: "",
  });

  const [form, setForm] = useState(initialform);

  // Lógica para cargar datos si es una SALIDA basada en un INGRESO previo
  useEffect(() => {
    if (form.movimiento === "SALIDA" && form.codigoIngreso) {
      const fetchIngresoData = async () => {
        try {
          const res = await axios.get("/getMovimientoByCodigo", {
            params: { codigoIngreso: form.codigoIngreso },
          });

          const ingreso = res.data;

          if (ingreso) {
            setForm((prev) => ({
              ...prev,
              contrato: ingreso.contratoId.cliente,
              numeroDeActa: ingreso.numeroDeActa,
              contribuyente: ingreso.contribuyente,
              numeroDocumento: ingreso.numeroDocumento,
              datosGenerales: {
                ...ingreso.datosGenerales,
              },
              descripcionBienes: ingreso.descripcionBienes.map((bien) => ({
                ...bien,
                bienIdOriginal: bien._id,
                // Al ser una salida, la "cantidadIngresada" del formulario 
                // se pre-carga con lo que había disponible
                cantidadIngresada: bien.cantidadDisponible,
              })),
            }));
          }
        } catch (err) {
          sendMessage("Error al buscar el ingreso por código", "Error");
        }
      };

      fetchIngresoData();
    }
  }, [form.movimiento, form.codigoIngreso]);

  const { error, validateForm } = useValidation(form);

  const contratoOptions = contratos || [];

  const resetForm = () => {
    setForm(initialform);
  };

  const register = async () => {
    sendMessage("Registrando movimiento...", "Info", true);

    try {
      // Limpiamos campos opcionales para la validación estricta si fuera necesario
      const formParaValidar = { ...form };

      const { isValid, firstInvalidPath } = validateForm(formParaValidar);

      if (!isValid) {
        sendMessage(`Debes completar: ${firstInvalidPath}`, "Error");
        return;
      }

      // Buscamos IDs de Sede y Contrato
      const findSede = contratos_id[0]?.sedeId;
      const findContrato = contratos_id.find(c => c.cliente === form.contrato);

      if (!findContrato) {
        return sendMessage("Contrato no válido", "Error");
      }

      // Preparamos los bienes asegurando tipos de datos correctos (Numbers)
      const descripcionBienes = form.descripcionBienes.map((bien, i) => ({
        ...bien,
        item: i + 1,
        // Convertimos a número para evitar problemas en el Backend
        cantidadIngresada: Number(bien.cantidadIngresada),
        cantidadDisponible: Number(bien.cantidadIngresada), // En el ingreso, ambos son iguales
        pesoNeto: Number(bien.pesoNeto) || 0,
        pesoBruto: Number(bien.pesoBruto) || 0,
      }));

      // Petición única: Crea Movimiento y genera los documentos de Stock
      await axios.post("/postMovimientoAlmacen", {
        ...form,
        contratoId: findContrato._id,
        sedeId: findSede._id,
        descripcionBienes,
        creadoPor: user._id,
      });

      sendMessage("Registrado correctamente en Movimientos y Stock", "Bien");
      resetForm();
    } catch (error) {
      console.error(error);
      sendMessage(error.response?.data?.message || error.message, "Error");
    }
  };

  return (
    <div className="px-5">
      <CardPlegable title="Datos Básicos">
        <DatosBasicos
          form={form}
          setForm={setForm}
          contratoOptions={contratoOptions}
          error={error}
        />
      </CardPlegable>

      <CardPlegable title="Datos Generales">
        <DatosGenerales form={form} setForm={setForm} error={error} />
      </CardPlegable>

      <CardPlegable title="Descripción de los Bienes Involucrados">
        <Directorio
          ItemComponent={DescripcionDeBienes}
          data="descripcionBienes"
          estilos="flex justify-center items-center"
          directory={form.descripcionBienes}
          sendMessage={sendMessage}
          setForm={setForm}
          error={error}
        />
      </CardPlegable>

      <CardPlegable title="Otros">
        <Otros form={form} setForm={setForm} error={error} />
      </CardPlegable>

      <div className="flex justify-center m-10">
        <ButtonOk
          type="ok"
          onClick={register}
          classe="!w-64 !text-xl !p-3"
        >
          Registrar
        </ButtonOk>
      </div>
    </div>
  );
};

export default RegisterLurin;