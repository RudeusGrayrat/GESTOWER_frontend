import ReadOrCreate from "../../../components/Principal/Principal";
import List from "./List/List";
import Register from "./Register/Register";
import Reporte from "./Reporte/Resporte";

const PlantillaContrato = ({ submodule = "PLANTILLAS" }) => {
  return (
    <ReadOrCreate
      ItemList={List}
      ItemRegister={Register}
      ItemReporte={Reporte}
      submodule={submodule}
    />
  );
};
export default PlantillaContrato;
