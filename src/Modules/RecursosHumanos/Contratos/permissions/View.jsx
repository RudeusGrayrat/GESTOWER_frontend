import { useEffect, useMemo, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import PDetail from "../../../../recicle/PDtail";
import PopUp from "../../../../recicle/popUps";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../../api/axios";
import renderDoc from "./renderDoc";
import useSendMessage from "../../../../recicle/senMessage";
import { getBusiness, getPlantillasContrato } from "../../../../redux/modules/Recursos Humanos/actions";
import { obtenerUrlArchivo } from "../../../../utils/archivoLocal";

const ViewContract = ({ setShowDetail, selected }) => {
  const dispatch = useDispatch();
  const [plantillas, setPlantillas] = useState([]);
  const [plantillasCargadas, setPlantillasCargadas] = useState(false);
  const plantillasContrato = useSelector((state) => state.recursosHumanos.allPlantillasContrato);
  const empresas = useSelector((state) => state.recursosHumanos.business);
  const sendMessage = useSendMessage();
  useEffect(() => {
    if (empresas.length === 0) {
      dispatch(getBusiness());
    }
  }, [dispatch, empresas]);

  useEffect(() => {
    axios.get("/plantillas")
      .then((response) => setPlantillas(response.data))
      .catch(() => setPlantillas([]))
      .finally(() => setPlantillasCargadas(true));
  }, []);
  useEffect(() => {
    if (!plantillasContrato.length) dispatch(getPlantillasContrato());
  }, [dispatch, plantillasContrato.length]);

  const findPlantillaLocal = plantillas.find(
    (plantilla) => plantilla.tipo === "CONTRATO" && plantilla.tipoContrato === selected?.typeContract && plantilla.state === "ACTIVO"
  );
  const findPlantilla = findPlantillaLocal || (plantillasCargadas && plantillasContrato.find(
    (plantilla) => plantilla.tipoContrato === selected?.typeContract && plantilla.state === "ACTIVO"
  ));

  const findBusiness = useMemo(() => {
    if (!selected?.colaborador?.business) return null;
    return empresas.find(
      (empresa) => empresa?.razonSocial === selected?.colaborador?.business
    );
  }, [empresas, selected?.colaborador?.business]);

  useEffect(() => {
    const renderDocx = async () => {
      try {
        if (!selected || !findBusiness || !findPlantilla) return;
        const file = await renderDoc(
          selected,
          findBusiness,
          findPlantillaLocal ? obtenerUrlArchivo(findPlantilla.archivo) : findPlantilla?.archivo
        );
        if (!file) {
          sendMessage("Error al cargar el archivo", "Error");
          return;
        }
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        sendMessage(error, "Error");
      }
    };

    renderDocx();
  }, [findBusiness, findPlantilla, selected]);

  return (
    <Details setShowDetail={setShowDetail} title="Contrato">
      <p>{findPlantilla ? "Generando descarga del documento..." : "No hay plantilla activa para este contrato."}</p>
    </Details>
  );
};

export default ViewContract;
