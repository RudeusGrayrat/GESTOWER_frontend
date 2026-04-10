import { useAuth } from "../../../../context/AuthContext";
import ButtonOk from "../../../../recicle/Buttons/Buttons"
import useSendMessage from "../../../../recicle/senMessage";

const SendHorasExtras = ({ setShowSend, selected, reload }) => {
    const sendMessage = useSendMessage();
    const { user } = useAuth();
    const handleSend = async () => {
        sendMessage("Enviando horas extras...", "Cargando", true);
        try {
            if (selected.estado === "ENVIADO") {
                sendMessage("Las horas extras ya han sido enviadas.", "Advertencia");
                return;
            }
            if (!selected.colaborador) {
                sendMessage("No se encontró el colaborador asociado a las horas extras.", "Error");
                return;
            }
            const response = await axios.patch(`/rrhh/patchHorasExtras/`,
                {
                    _id: selected._id,
                    estado: "ENVIADO",
                    enviadoPor: user._id
                }
            );
            if (response.data.type === "Correcto") {
                sendMessage("Horas extras enviadas exitosamente.", "Correcto");
            }
            reload();
        } catch (error) {
            sendMessage(error, "Error");
        } finally {
            setShowSend(false);
        }
    }

    return (
        <div className="fixed top-0 z-40 left-0 right-0 bottom-0 flex justify-center items-center"
        >
            <div className="flex flex-col  bg-white p-8 border-2 rounded-lg shadow-lg ">
                <div className="">
                    <h1 className="p-4 font-bold text-red-600 text-center text-5xl">
                        Espere
                    </h1>
                    <h1 className="p-4 text-center text-xl">
                        ¿Está seguro que desea enviarlo?
                    </h1>
                </div>
                <div className="flex justify-center items-center">
                    <ButtonOk
                        onClick={() => setShowSend(false)}
                        styles={"!w-full m-4 flex justify-center mx-4"}
                        classe={"!w-24"}
                        children="NO"
                    />
                    <ButtonOk
                        onClick={handleSend}
                        type="ok"
                        styles={"!w-full m-4 flex justify-center mx-4"}
                        classe={"!w-24"}
                        children="SI"
                    />
                </div>
            </div>
        </div>
    )
}

export default SendHorasExtras