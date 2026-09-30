import { useEffect, useRef, useState } from "react";
import renderDoc from "../Enviar/renderDoc";
import { useDispatch, useSelector } from "react-redux";
import Details from "../../../../components/Principal/Permissions/View";
import useSendMessage from "../../../../recicle/senMessage";
import { getBusiness, getDatosContables } from "../../../../redux/modules/Recursos Humanos/actions";

const ViewBoletaDePago = ({ setShowDetail, selected }) => {
  const [estadoDocumento, setEstadoDocumento] = useState("Generando documento...");
  const documentoGenerado = useRef("");
  const dispatch = useDispatch();
  const sendMessage = useSendMessage();
  const datosContables = useSelector((state) => state.recursosHumanos.datosContables || []);

  useEffect(() => {
    if (!datosContables.length) dispatch(getDatosContables());
  }, [dispatch, datosContables.length]);
  const business = selected.empresaColaborador;
  useEffect(() => {
    const renderDocx = async () => {
      try {
        if (!selected || !business || !datosContables.length) return;
        const claveDocumento = `${selected._id}-${business._id}-${datosContables.length}`;
        if (documentoGenerado.current === claveDocumento) return;
        documentoGenerado.current = claveDocumento;

        const file = await renderDoc(
          {
            ...selected,
            // codigoSpp: findContrato?.codigoSpp,
            // regimenPension: findContrato?.regimenPension,
            regimenPension: selected.colaborador?.regimenPension || "",
            codigoSpp: selected.codigoSpp || selected.colaborador?.codigoSpp || "",
          },
          business,
          datosContables
        );
        if (!file) {
          sendMessage("Error al cargar el archivo", "Error");
          return;
        }
        const fechaConGuion = selected.fechaBoletaDePago.replace(/\//g, "-");
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selected.colaborador?.lastname}_${selected.colaborador?.name}_${fechaConGuion}.docx`;
        link.click();
        URL.revokeObjectURL(url);
        setEstadoDocumento("Documento descargado correctamente.");
      } catch (error) {
        setEstadoDocumento("No se pudo generar el documento.");
        sendMessage(error.message || String(error), "Error");
      }
    };
    renderDocx();
  }, [business?._id, selected?._id, datosContables.length]);
  return (
    <Details setShowDetail={setShowDetail} title="Boleta de Pago">
      <p>{estadoDocumento}</p>
    </Details>
  );
};

export default ViewBoletaDePago;
