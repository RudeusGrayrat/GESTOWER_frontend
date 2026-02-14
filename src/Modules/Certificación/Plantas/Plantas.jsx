import ReadOrCreate from "../../../components/Principal/Principal"
import ListPlantas from "./List/List";
import RegisterPlanta from "./Register/Register";

const Plantas = () => {
    return (
        <ReadOrCreate
            ItemList={ListPlantas}
            ItemRegister={RegisterPlanta}
            submodule={"PLANTAS"}
        />
    )
}

export default Plantas;