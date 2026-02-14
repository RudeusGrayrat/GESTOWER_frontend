import ReadOrCreate from "../../../components/Principal/Principal"
import ListUbigeo from "./List/ListUbigeo"
import RegisterUbigeo from "./Register/Register"

const Ubigeo = () => {
    return (
        <ReadOrCreate
            ItemList={ListUbigeo}
            ItemRegister={RegisterUbigeo}
            submodule={"UBIGEO"}
        />
    )
}

export default Ubigeo