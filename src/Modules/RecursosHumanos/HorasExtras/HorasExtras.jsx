import ReadOrCreate from "../../../components/Principal/Principal"
import ListHorasExtras from "./List/List"
import RegisterHorasExtras from "./Register/Register"

const HorasExtras = () => {
    return (
        <ReadOrCreate
            ItemList={ListHorasExtras}
            ItemRegister={RegisterHorasExtras}
            submodule={"HORAS EXTRAS"}
        />
    )
}

export default HorasExtras