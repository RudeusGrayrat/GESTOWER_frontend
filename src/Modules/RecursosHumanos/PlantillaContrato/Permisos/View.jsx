import Details from "../../../../components/Principal/Permissions/View";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import PDetail from "../../../../recicle/PDtail";
import PopUp from "../../../../recicle/popUps";
import { obtenerUrlArchivo } from "../../../../utils/archivoLocal";

const ViewPlantillaContrato = ({ setShowDetail, selected }) => {
  const descarga = async () => {
    try {
      const response = await fetch(obtenerUrlArchivo(selected.archivo));
      const blob = await response.blob(); // Convertir a blob

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selected.archivoNombre || `${selected.nombre}.docx`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      throw new Error("Error al descargar el archivo");
    } finally {}
  };

  return (
    <Details setShowDetail={setShowDetail}>
      <PopUp />
      <div className="flex flex-col h-full  justify-center">
        <PDetail content="Tipo: " value={selected.tipo} />
        {selected.tipo === "CONTRATO" && <PDetail content="Tipo de Contrato: " value={selected.tipoContrato} />}
        <PDetail content="Estado: " value={selected.state} />
        <PDetail content="Fecha de Subida: " value={selected.createdAt} />
        <PDetail content="Archivo: " />
        <ButtonOk type="ok" onClick={descarga}>
          Descargar
        </ButtonOk>
      </div>
    </Details>
  );
};

export default ViewPlantillaContrato;
