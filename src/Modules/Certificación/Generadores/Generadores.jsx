import ReadOrCreate from "../../../components/Principal/Principal";
import ListGeneradores from "./List/ListGeneradores";
import Register from "./Register/Register";

const Generadores = () => {
    return (
        <ReadOrCreate
            ItemList={ListGeneradores}
            ItemRegister={Register}
            submodule="GENERADORES" />
    )
}

export default Generadores;