import ReadOrCreate from "../../../components/Principal/Principal"
import ListHorasExtras from "./List/List"
import ReportPermisosRH from "./Permissions/Report"
import RegisterHorasExtras from "./Register/Register"

const HorasExtras = () => {
    return (
        <ReadOrCreate
            ItemList={ListHorasExtras}
            ItemRegister={RegisterHorasExtras}
            ItemReporte={ReportPermisosRH}
            submodule={"HORAS EXTRAS"}
        />
    )
}

export default HorasExtras