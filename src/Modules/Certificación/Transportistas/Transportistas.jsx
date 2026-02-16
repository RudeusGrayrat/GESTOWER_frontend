import ReadOrCreate from "../../../components/Principal/Principal";
import ListTransportistas from "./List/List";
import RegisterTransportistas from "./Register/Register";

const Transportistas = () => {
    return (
        <ReadOrCreate
            ItemList={ListTransportistas}
            ItemRegister={RegisterTransportistas}
            submodule={"TRANSPORTISTAS"}
        />
    )

}

export default Transportistas;