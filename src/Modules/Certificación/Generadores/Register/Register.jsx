import { useState } from "react";
import CardPlegable from "../../../../recicle/Divs/CardPlegable";
import DatosBasicos from "./DatosBasicos";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useSendMessage from "../../../../recicle/senMessage";
import PopUp from "../../../../recicle/popUps";
import { setMessage } from "../../../../redux/actions";
import axios from "../../../../api/axios"
import DatosPlanta from "./DatosPlanta";
import Directorio from "../../../../components/RemoveAdd/RemoveItemAdd";
import Responsable from "./Responsable";

const Register = ({ editForm, setEditForm }) => {
    const sendMessage = useSendMessage()
    const [deshabilitar, setDeshabilitar] = useState(false)
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
    const resetForm = () => {
        if (Object.values(form).some(value => value !== "")) {
            setForm({
                razonSocial: "",
                ruc: "",
                correoElectronico: "",
                telefono: "",
                representanteLegal: "",
                dniRepresentante: "",
                plantas: [{
                    denominacion: "",
                    tipoPlanta: "",
                    direccion: "",
                    ubigeoId: "",
                    coordenadasUtm: { norte: "", este: "", zona: "" },
                    actividadEconomica: "",
                    sector: "",
                    tieneIga: false,
                    institucionApruebaIga: "",
                    fechaAprobacionIga: "",
                    numeroResolucionIga: "",
                }],
                responsablesTecnicos: [{
                    nombreResponsable: "",
                    dniResponsable: "",
                    cargoResponsable: "",
                    correoResponsable: "",
                    telefonoResponsable: "",
                    firmaResponsable: null,
                }]
            });
        }
    }
    const register = async () => {
        setDeshabilitar(true);
        sendMessage("Registrando generador...", "Cargando", true);
        try {
            if (Object.values(form).some(value => value === "")) {
                sendMessage("Por favor, complete todos los campos del formulario.", "Advertencia");
                return;
            }

            // ✅ Todo ya viene en base64 desde InputFile — enviar directo
            const response = await axios.post("/certificaciones/postGenerador", form);
            const data = response.data;

            if (data.type === "Correcto") {
                sendMessage(data.message, data.type || "Correcto");
                resetForm();
            }
        } catch (error) {
            sendMessage(error, error.type || "Error");
        } finally {
            setDeshabilitar(false);
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