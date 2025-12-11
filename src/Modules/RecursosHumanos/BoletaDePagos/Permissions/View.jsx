import { useEffect, useState, useMemo } from "react";
import renderDoc from "../Enviar/renderDoc";
import { useDispatch, useSelector } from "react-redux";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { getBusiness, getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";

const ViewBoletaDePago = ({ setShowDetail, selected }) => {
  const [showDoc, setShowDoc] = useState(false);
  const [docxContent, setDocxContent] = useState("");
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();

  const business = useSelector((state) => state.recursosHumanos.business || []);
  const datosContables = useSelector((state) => state.recursosHumanos.datosContables || []);

  // const convertirDate = (dateString) => {
  //   const [day, month, year] = dateString.split("/");
  //   const date = new Date(year, month - 1, day);
  //   return date;
  // };
  console.log("DATOS SELECIONADOS:", selected);
  useEffect(() => {
    if (!business.length) dispatch(getBusiness());
    if (!datosContables.length) dispatch(getDatosContables());
  }, [dispatch, business.length, datosContables.length]);

  const findBusiness = useMemo(() => {
    if (!selected?.colaborador?.business) return null;
    return business.find(
      (empresa) => empresa?.razonSocial === selected?.colaborador?.business
    );
  }, [business, selected?.colaborador?.business]);
  useEffect(() => {
    const renderDocx = async () => {
      try {
        if (!selected || !findBusiness) return;
        // const response = await axios.get(
        //   `/contract/${selected.colaborador._id}`
        // );
        // const contratosColaborador = response.data;

        // const findContrato = contratosColaborador
        //   .map((contrato) => ({
        //     ...contrato,
        //     parsedDateStart: convertirDate(contrato.dateStart),
        //   }))
        //   .filter((c) => c.parsedDateStart)
        //   .sort((a, b) => b.parsedDateStart - a.parsedDateStart)[0];

        const file = await renderDoc(
          {
            ...selected,
            // codigoSpp: findContrato?.codigoSpp,
            // regimenPension: findContrato?.regimenPension,
            regimenPension: selected.colaborador?.regimenPension,
          },
          findBusiness,
          datosContables
        );
        if (!file) {
          sendMessage("Error al cargar el archivo", "Error");
          return;
        }
        const fechaConGuion = selected.fechaBoletaDePago.replace(/\//g, "-");
        const pathCloudinary = await documentoCloudinary(
          file,
          `${selected.colaborador?.lastname}_${selected.colaborador?.name}_${fechaConGuion}`
        );
        setDocxContent(pathCloudinary.secure_url);
        setShowDoc(true);
        await axios.delete("/deleteDocument", {
          data: { public_id: pathCloudinary.public_id },
        });
      } catch (error) {
        sendMessage(error, "Error");
      }
    };
    renderDocx();
  }, [findBusiness, selected, datosContables]);

  const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
    docxContent
  )}`;
  return (
    <Details setShowDetail={setShowDetail} title="Boleta de Pago">
      {showDoc ? (
        <ButtonOk type="ok">
          <a href={officeViewerUrl} target="_blank" rel="noopener noreferrer">
            Abrir documento de Word en el visor de Office
          </a>
        </ButtonOk>
      ) : (
        <p>Cargando...</p>
      )}
    </Details>
  );
};

export default ViewBoletaDePago;
