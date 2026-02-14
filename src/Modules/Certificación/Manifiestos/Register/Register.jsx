import { useState } from "react";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import PopUp from "../../../../recicle/popUps";
import DatosGenerales from "./DatosGenerales";
import ResiduosPeligrosos from "./ResiduoPeligroso";
import ManejoResiduo from "./ManejoResiduo";

const RegisterManifiestos = () => {
    const [formManifiesto, setFormManifiesto] = useState({
        // Estado inicial del formulario
    });
    const register = async () => {
        // Lógica para registrar el manifiesto
    }
    const resetForm = () => {
        // Lógica para resetear el formulario
    }
    return (
        <div className="flex flex-col w-full p-6">
            <PopUp />
            <CardPlegable title="Datos Generales del Generador">
                <DatosGenerales form={formManifiesto} setForm={setFormManifiesto} />
            </CardPlegable>
            <CardPlegable title="Datos del Residuo Peligroso">
                <ResiduosPeligrosos />
            </CardPlegable>
            <CardPlegable title="Manejo del Residuo Peligroso">
                <ManejoResiduo />
            </CardPlegable>
            <div className="flex justify-center ">
                <ButtonOk
                    type="ok"
                    onClick={register}
                    classe="!w-32"
                    children="Registrar"
                />
                <ButtonOk
                    children="Cancelar"
                    classe="!w-32"
                    onClick={() => resetForm()}
                />
            </div>
        </div>
    )
}

export default RegisterManifiestos;