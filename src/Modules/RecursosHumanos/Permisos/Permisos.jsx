import ReadOrCreate from "../../../components/Principal/Principal"
import ListPermisos from "./List/List"
import RegisterPermisos from "./Register/Register"

const Permisos = () => {
    return (
        <ReadOrCreate
            ItemList={ListPermisos}
            ItemRegister={RegisterPermisos}
            module={"RECURSOS HUMANOS"}
            submodule={"PERMISOS"}
        />
    )
}

export default Permisos