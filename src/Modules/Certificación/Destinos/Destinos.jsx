import ReadOrCreate from "../../../components/Principal/Principal"
import ListDestinos from "./List/List";
import RegisterDestinos from "./Register/Register";

const Destinos = () => {
    return (
        <ReadOrCreate
            ItemList={ListDestinos}
            ItemRegister={RegisterDestinos}
            submodule={"DESTINOS"}
        />
    )
}

export default Destinos;