import { useDispatch, useSelector } from "react-redux";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import Input from "../../../../recicle/Inputs/Inputs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useValidation from "./validateEnviar";
import ListEnvio from "./ListEnvio";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import dayjs from "dayjs";
import { useAuth } from "../../../../context/AuthContext";
import renderDoc from "./renderDoc";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import PopUp from "../../../../recicle/popUps";
import axios from "../../../../api/axios";
import {
  getBusiness,
  getDatosContables,
} from "../../../../redux/modules/Recursos Humanos/actions";
import useSendMessage from "../../../../recicle/senMessage";

const Enviar = () => {
  const [deshabilitar, setDeshabilitar] = useState(false);
  const dispatch = useDispatch();
  const { enviarBoletasDePago } = useAuth();
  const [form, setForm] = useState({
    empresa: "",
    fechaBoletaDePago: "",
  });
  const [allBoletas, setAllBoletas] = useState([]);
  const datosContables = useSelector(
    (state) => state.recursosHumanos.datosContables
  );
  const sendMessage = useSendMessage();
  useEffect(() => {
    if (datosContables.length === 0) dispatch(getDatosContables());
  }, [dispatch, datosContables]);
  const business = useSelector((state) => state.recursosHumanos.business);
  useEffect(() => {
    if (business.length === 0) {
      dispatch(getBusiness());
    }
  }, [business]);
  const businessName = business?.map((item) => item.razonSocial);

  const { error, validateForm } = useValidation();

  const [boletasFiltrado, setBoletasFiltrado] = useState([]);

  const fetchData = useCallback(
    async (page = 0, limit = 10, search = "") => {
      if (!form.empresa || !form.fechaBoletaDePago) {
        return { data: [], total: 0 };
      }
      const response = await axios.get("/getBoletaDePagoByParams", {
        params: {
          page,
          limit,
          search,
          empresa: form.empresa,
          fechaBoletaDePago: dayjs(form.fechaBoletaDePago).format("MM/YYYY"),
        },
      });
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    },
    [form.empresa, form.fechaBoletaDePago]
  );
  const fetchAllEmployees = useCallback(async () => {
    if (!form.empresa || !form.fechaBoletaDePago) return [];

    try {
      const response = await axios.get("/getBoletaDePagoByParams", {
        params: {
          empresa: form.empresa,
          fechaBoletaDePago: dayjs(form.fechaBoletaDePago).format("MM/YYYY"),
          page: 0,
          limit: 100000, // para traer todo
        },
      });
      setAllBoletas(response.data?.data);
    } catch (error) {
      sendMessage(error.message || error, "Error");
    }
  }, [form.empresa, form.fechaBoletaDePago]);
  useEffect(() => {
    if (!fetchAllEmployees) return; // Si no se pasa fetchData, no hace nada.
    fetchAllEmployees();
  }, [form.empresa, form.fechaBoletaDePago, fetchAllEmployees]);

  const enviarCorreo = async (arrayBoletas) => {
    await setDeshabilitar(true);
    try {
      sendMessage("Enviando Correo...", "Espere");
      const formIsValide = validateForm(form);
      if (formIsValide) {
        if (!arrayBoletas || arrayBoletas.length === 0) {
          sendMessage("No hay boletas disponibles", "Error");
          return;
        }
        // .filter((item) => !item.envio)
        const datosBoleta = arrayBoletas.map(async (item) => {
          const newForm = {
            situacion: "ACTIVO O SUBSIDIADO",
            tipoT: "EMPLEADO",
            ...item,
          };

          const findBusiness = business.find(
            (empresa) => empresa.razonSocial === item.colaborador.business
          );
          const docxTranscript = await renderDoc(
            newForm,
            findBusiness,
            datosContables
          );
          const cloudinaryUrl = await documentoCloudinary(docxTranscript);
          await axios.delete("/deleteDocument", {
            data: { public_id: cloudinaryUrl.public_id },
          });
          return {
            archivoUrl: cloudinaryUrl.secure_url,
            email: item.colaborador.email,
            fechaBoletaDePago: item.fechaBoletaDePago,
            empresa: item.colaborador.business,
            colaborador:
              item.colaborador.lastname + " " + item.colaborador.name,
            boletaId: item._id,
          };
        });

        const newForm = await Promise.all(datosBoleta);

        const response = await enviarBoletasDePago({
          datosBoleta: newForm,
          business: form.empresa,
        });
        if (!response)
          return sendMessage("Error al generar la boleta", "Error");
        sendMessage(response, "Ok");
      } else {
        sendMessage("Complete los campos", "Error");
      }
    } catch (error) {
      sendMessage(error, "Error");
    } finally {
      setDeshabilitar(false);
    }
  };

  return (
    <div>
      <PopUp deshabilitar={deshabilitar} />
      <CardPlegable title="Datos de Envío">
        <div className="flex">
          <Input
            label="Empresa"
            options={businessName}
            type="select"
            name="empresa"
            value={form.empresa}
            setForm={setForm}
            errorOnclick={error.empresa}
          />
          <Input
            label="Fecha De Boleta"
            type="month"
            name="fechaBoletaDePago"
            value={form.fechaBoletaDePago}
            setForm={setForm}
            errorOnclick={error.fechaBoletaDePago}
          />
          <ButtonOk
            styles={" flex flex-col justify-end h-20 mx-4 py-3 "}
            onClick={() => enviarCorreo(allBoletas)}
            children="Enviar a todos"
            type="ok"
          />
        </div>
      </CardPlegable>
      <CardPlegable title="Tabla de Envíos">
        <ListEnvio
          key={`${form.empresa}-${form.fechaBoletaDePago}`}
          fetchData={fetchData}
          enviarCorreo={enviarCorreo}
        />
      </CardPlegable>
    </div>
  );
};

export default Enviar;
