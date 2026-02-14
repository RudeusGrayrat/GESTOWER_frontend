import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import Representante from "./Representante";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios"

const Register = () => {
    const sendMessage = useSendMessage()
    const [deshabilitar, setDeshabilitar] = useState(false)
    const [form, setForm] = useState({
        razonSocial: "",
        ruc: "",
        direccion: "",
        correoElectronico: "",
        telefono: "",
        representanteLegal: "",
        dniRepresentante: "",
    });
    const register = async () => {
        setDeshabilitar(true);
        setMessage("Registrando generador...", "Cargando");
        try {
            if (Object.values(form).some(value => value === "")) {
                sendMessage("Por favor, complete todos los campos del formulario.", "Advertencia");
                return;
            }
            const response = await axios.post("/certificaciones/postGenerador", form)
            const data = response.data;
            sendMessage(data.message, data.type || "Correcto");
        } catch (error) {
            sendMessage(error, error.type || "Error")
        } finally {
            setDeshabilitar(false);
        }
    }
    const resetForm = () => {
        if (Object.values(form).some(value => value !== "")) {
            setForm({
                razonSocial: "",
                ruc: "",
                direccion: "",
                correoElectronico: "",
                telefono: "",
                representanteLegal: "",
                dniRepresentante: "",
            });
        }
    }
    return (
        <div className="w-full p-4">
            <PopUp deshabilitar={deshabilitar} />
            <CardPlegable title="Datos Basicos" >
                <DatosBasicos form={form} setForm={setForm} />
            </CardPlegable>
            <CardPlegable title="Representante" >
                <Representante form={form} setForm={setForm} />
            </CardPlegable>
            <div className="flex justify-center ">
                <ButtonOk
                    children="Cancelar"
                    classe="!w-32"
                    onClick={() => resetForm()}
                />
                <ButtonOk
                    type="ok"
                    onClick={register}
                    classe="!w-32"
                    children="Registrar"
                />
            </div>
        </div>

    );
};

export default Register;