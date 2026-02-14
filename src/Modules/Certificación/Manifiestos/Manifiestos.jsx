import ReadOrCreate from "../../../components/Principal/Principal";
import ListManifiestos from "./List/List";
import RegisterManifiestos from "./Register/Register";

const Manifiestos = () => {
    return <ReadOrCreate
        ItemList={ListManifiestos}
        ItemRegister={RegisterManifiestos}
        submodule="MANIFIESTOS" />;
}

export default Manifiestos;