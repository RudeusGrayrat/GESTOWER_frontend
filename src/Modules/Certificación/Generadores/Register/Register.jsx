import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import axios from "../../../../api/axios"
import DatosPlanta from "./DatosPlanta";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import Responsable from "./Responsable";

const Register = ({ editForm, setEditForm }) => {
    const sendMessage = useSendMessage()
    const [form, setForm] = useState({
        razonSocial: "",
        ruc: "",
        correoElectronico: "",
        telefono: "",
        representanteLegal: "",
        dniRepresentante: "",
        plantas: [],
        responsablesTecnicos: []
    });
    const validateForm = () => {
        if (!form.razonSocial) return "Falta razón social";
        if (!form.ruc) return "Falta RUC";
        if (!form.correoElectronico) return "Falta correo";
        if (!form.telefono) return "Falta teléfono";
        if (!form.representanteLegal) return "Falta representante";
        if (!form.dniRepresentante) return "Falta DNI";

        if (!form.plantas || form.plantas.length === 0)
            return "Debe agregar al menos una planta";

        if (!form.responsablesTecnicos || form.responsablesTecnicos.length === 0)
            return "Debe agregar al menos un responsable";

        return null;
    };
    const resetForm = () => {
        setForm({
            razonSocial: "",
            ruc: "",
            correoElectronico: "",
            telefono: "",
            representanteLegal: "",
            dniRepresentante: "",
            plantas: [],
            responsablesTecnicos: []
        });
    }

    const register = async () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            sendMessage(errorMsg, "Info");
            return;
        }
        sendMessage("Registrando generador...", "Cargando", true);
        try {

            // ✅ Todo ya viene en base64 desde InputFile — enviar directo
            const response = await axios.post("/certificaciones/postGenerador", form);
            const data = response.data;

            if (data.type === "Correcto") {
                sendMessage(data.message, data.type || "Correcto");
                resetForm();
            }
        } catch (error) {
            sendMessage(error, error.type || "Error");
        }
    }
    return (
        <div className="w-full p-4 ">
            <CardPlegable title="Datos Basicos"   >
                <DatosBasicos form={editForm ? editForm : form} setForm={setEditForm ? setEditForm : setForm} />
            </CardPlegable>
            <CardPlegable title="Plantas"  >
                <Directorio
                    ItemComponent={DatosPlanta}
                    setForm={setEditForm ? setEditForm : setForm}
                    directory={editForm ? editForm.plantas : form?.plantas}
                    data="plantas"
                    estilos="flex items-center pl-4  "
                />
            </CardPlegable>
            <CardPlegable title="Responsables"  >
                <Directorio
                    ItemComponent={Responsable}
                    setForm={setEditForm ? setEditForm : setForm}
                    directory={editForm ? editForm.responsablesTecnicos : form?.responsablesTecnicos}
                    data="responsablesTecnicos"
                    estilos="flex items-center pl-4 "
                />
            </CardPlegable>
            {!editForm && (
                <div className="flex justify-center ">
                    <ButtonOk
                        children="Cancelar"
                        classe="!w-60 !p-3 !text-xl"
                        onClick={() => resetForm()}
                    />
                    <ButtonOk
                        type="ok"
                        onClick={register}
                        classe="!w-60 !p-3 !text-xl"
                        children="Registrar"
                    />
                </div>
            )}
        </div >

    );
};

export default Register;