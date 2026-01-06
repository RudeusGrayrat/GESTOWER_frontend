import { useEffect, useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import DatosGenerales from "./DatosGenerales";
import DescripcionDeBienes from "./DescripcionDeBienes";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd copy";
import Otros from "./Otros";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { useAuth } from "../../../../context/AuthContext";
import useValidation from "./Validate";
import axios from "../../../../api/axios";

const RegisterLurin = ({ contratos, contratos_id }) => {
  const sendMessage = useSendMessage();

  const [habilitar, setHabilitar] = useState(false);
  const { user } = useAuth();
  const [initialform, setInitialform] = useState({
    movimiento: "INGRESO",
    contrato: "",
    numeroDeActa: "",
    contribuyente: "",
    numeroDocumento: "",
    productos: [
      {
        item: "",
        cantidad: "",
        descripcion: "",
        unidadDeMedida: "",
        pesoNeto: "",
        pesoBruto: "",
        estadoEnvase: "",
        subItem: "",
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
  const [form, setForm] = useState({
    ...initialform
  });

  useEffect(() => {
    if (form.movimiento === "SALIDA" && form.codigoIngreso) {
      const fetchIngresoData = async () => {
        try {
          const res = await axios.get("/getMovimientoByCodigo", {
            params: { codigoIngreso: form.codigoIngreso },
          });
          const ingreso = res.data;
          console.log("Ingreso encontrado:", ingreso);
          if (ingreso) {
            setForm((prev) => ({
              ...prev,
              contrato: ingreso.contratoId.cliente,
              numeroDeActa: ingreso.numeroDeActa,
              contribuyente: ingreso.contribuyente,
              numeroDocumento: ingreso.numeroDocumento,
              datosGenerales: {
                fecha: ingreso.datosGenerales.fecha,
                horaIngreso: ingreso.datosGenerales.horaIngreso,
                recepcionadoPor: ingreso.datosGenerales.recepcionadoPor,
                dniRecepcionadoPor: ingreso.datosGenerales.dniRecepcionadoPor,
                responsableEntrega: ingreso.datosGenerales.responsableEntrega,
                registroOCIP: ingreso.datosGenerales.registroOCIP,
              },
              productos: ingreso.descripcionBienes.map((producto) => ({
                item: producto.item,
                cantidad: producto.cantidad,
                descripcion: producto.productoId.descripcion,
                unidadDeMedida: producto.productoId.unidadDeMedida,
                pesoNeto: producto.pesoNeto,
                pesoBruto: producto.pesoBruto,
                estadoEnvase: producto.estadoEnvase,
                subItem: producto.productoId.subItem,
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

  //aquí empieza el cambio con lo de producto y stock
  const register = async () => {
    setHabilitar(true);
    const erroresDeStock = [];

    try {
      // ========================
      // 🛑 Validación del formulario
      // ========================
      const formAntesDeValidar = { ...form };
      delete formAntesDeValidar.horaSalida;
      delete formAntesDeValidar.fechaSalida;
      delete formAntesDeValidar.observaciones;
      delete formAntesDeValidar.detallesDePeso;
      delete formAntesDeValidar.referenciaImagen;
      delete formAntesDeValidar.codigoIngreso;

      const { isValid, firstInvalidPath } = validateForm(formAntesDeValidar);

      if (!isValid) {
        sendMessage(`Debes completar: ${firstInvalidPath}`, "Error");
        return;
      }

      const findSede = contratos_id[0].sedeId;
      const findContrato = contratos_id.find(
        (contrato) => contrato.cliente === form.contrato
      );

      if (!findContrato) {
        sendMessage("Contrato no encontrado", "Error");
        return;
      }

      // ========================
      // 🚨 FASE 1: VALIDACIÓN PREVIA
      // ========================
      const productosProcesados = [];

      for (const producto of form.productos) {
        const { cantidad, ...restProducto } = producto;

        // Buscar si ya existe
        const responseProducto = await axios.get("/getProductoAlmacen", {
          params: {
            descripcion: restProducto.descripcion,
            unidadDeMedida: restProducto.unidadDeMedida,
            subItem: restProducto.subItem,
          },
        });

        let productoId = responseProducto.data?._id || null;
        let stockActual = 0;
        let stockId = null;
        if (!productoId && form.movimiento === "INGRESO") {
          const nuevoProducto = await axios.post("/postProductoAlmacen", {
            descripcion: producto.descripcion,
            unidadDeMedida: producto.unidadDeMedida,
            subItem: producto.subItem,
          });
          productoId = nuevoProducto.data.producto._id;
        }

        if (productoId) {
          const responseStockArray = await axios.get("/getStockByParams", {
            params: { productoId },
          });
          const responseStock = responseStockArray.data[0] || {};

          stockActual = Number(responseStock?.cantidadTotal || 0);
          stockId = responseStock._id || null;

          if (form.movimiento === "SALIDA" && stockActual < cantidad) {
            erroresDeStock.push({
              descripcion: restProducto.descripcion,
              stockActual,
              cantidadSolicitada: cantidad,
            });
          }
        } else {
          if (form.movimiento === "SALIDA") {
            erroresDeStock.push({
              descripcion: restProducto.descripcion,
              motivo: "El producto no existe en el almacén",
            });
          }
        }

        productosProcesados.push({
          ...restProducto,
          cantidad: Number(cantidad),
          productoId,
          stockId,
          stockActual,
        });
      }

      // 🚫 Detener si hay errores
      if (erroresDeStock.length > 0) {
        let mensaje =
          "No se pudo registrar el movimiento. Revisa los siguientes productos:\n\n";
        erroresDeStock.forEach((error, i) => {
          if (error.motivo) {
            mensaje += `${i + 1}. ${error.descripcion} - ${error.motivo}\n`;
          } else {
            mensaje += `${i + 1}. ${error.descripcion} - Solicitado: ${error.cantidad
              }, Stock disponible: ${error.stockActual}\n`;
          }
        });
        sendMessage(mensaje, "Advertencia");
        return;
      }

      // ========================
      // ✅ FASE 2: CREAR MOVIMIENTO
      // ========================
      const descripcionBienes = productosProcesados.map((p, i) => ({
        item: i + 1,
        productoId: p.productoId, // puede ser null si no existía → se resolverá después
        cantidad: p.cantidad,
        unidadDeMedida: p.unidadDeMedida,
        pesoNeto: p.pesoNeto,
        pesoBruto: p.pesoBruto,
        estadoEnvase: p.estadoEnvase,
      }));

      const responseMovimiento = await axios.post("/postMovimientoAlmacen", {
        ...form,
        contratoId: findContrato._id,
        sedeId: findSede._id,
        descripcionBienes: descripcionBienes,
        creadoPor: user._id,
      });

      const movimientoId = responseMovimiento.data?.data?._id;
      if (!movimientoId) throw new Error("No se pudo obtener movimientoId");

      // ========================
      // 🔄 FASE 3: ACTUALIZAR / CREAR STOCKS
      // ========================
      for (const p of productosProcesados) {
        let productoId = p.productoId;

        // Si no existe producto y es ingreso → lo creamos
        if (!productoId && form.movimiento === "INGRESO") {
          const nuevoProducto = await axios.post("/postProductoAlmacen", {
            descripcion: p.descripcion,
            unidadDeMedida: p.unidadDeMedida,
            subItem: p.subItem,
          });
          productoId = nuevoProducto.data.producto._id;
        }

        if (productoId) {
          if (p.stockId !== null) {
            const nuevaCantidad =
              form.movimiento === "SALIDA"
                ? p.stockActual - p.cantidad
                : p.stockActual + p.cantidad;

            if (nuevaCantidad < 0) {
              // 🚨 Evitar que el stock quede negativo
              throw new Error(
                `No hay suficiente stock de ${p.descripcion}. Disponible: ${p.stockActual}, solicitado: ${p.cantidad}`
              );
            }

            await axios.patch("/patchStockAlmacen", {
              _id: p.stockId,
              cantidadTotal: nuevaCantidad,
              actualizadoPor: user._id,
            });
          } else {
            if (form.movimiento === "INGRESO") {
              // ✅ Solo en ingreso se permite crear un nuevo stock
              await axios.post("/postStockAlmacen", {
                sedeId: findSede._id,
                productoId,
                contratoId: findContrato._id,
                cantidadTotal: p.cantidad,
                cantidadDisponible: p.cantidad,
                movimientoId,
                creadoPor: user._id,
              });
            } else {
              // 🚨 Evitar crear stock en salida si no existe
              throw new Error(
                `No existe stock para ${p.descripcion}, no se puede realizar salida`
              );
            }
          }
        }
      }

      // ========================
      // 🎉 FIN
      // ========================
      sendMessage("Registrado correctamente", "Bien");
      resetForm();
      return;
    } catch (error) {
      return sendMessage(
        error?.response?.data?.message?._message ||
        error?.response?.data?.message ||
        error.message ||
        "Error al registrar el movimiento",
        "Error"
      );
    } finally {
      setHabilitar(false);
    }
  };

  const resetForm = () => {
    setForm(initialform);
  };

  return (
    <div className="px-5">
      <PopUp deshabilitar={habilitar} />
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
      <CardPlegable title="Descripción de los Bienes Involucrados (Productos)">
        <Directorio
          ItemComponent={DescripcionDeBienes}
          data="productos"
          estilos=" flex justify-center items-center"
          directory={form.productos}
          sendMessage={sendMessage}
          setForm={setForm}
          error={error}
        />
      </CardPlegable>

      <CardPlegable title="Otros">
        <Otros form={form} setForm={setForm} error={error} />
      </CardPlegable>
      <div className="flex justify-center m-10 ">
        <ButtonOk
          type="ok"
          onClick={register}
          classe="!w-60"
          children="Registrar"
        />
      </div>
    </div>
  );
};

export default RegisterLurin;
