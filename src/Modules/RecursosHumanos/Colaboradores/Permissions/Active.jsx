import { useDispatch } from "react-redux";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import useref from "../../../../recicle/useRef";
import { getEmployees, setMessage } from "../../../../redux/actions";
import { useAuth } from "../../../../context/AuthContext";

const Active = ({ setShowApprove, selected }) => {
  const ref = useref(setShowApprove);
  const { updateEmployee } = useAuth();
  const estado = "ACTIVO";
  const dispatch = useDispatch();
  const id = selected._id;
  const handleApprove = async () => {
    try {
      await updateEmployee({ _id: id, state: estado });
      dispatch(getEmployees());
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    }
  };
  return (
    <div
      ref={ref}
      className="fixed top-0 z-40 left-0 right-0 bottom-0 flex justify-center items-center"
    >
      <div className="flex flex-col bg-white p-8 border-2 rounded-lg shadow-lg">
        <div>
          <h1 className="p-4 font-bold text-red-600 text-center text-5xl">
            Atención !
          </h1>
          <h1 className="p-4 text-center text-xl">
            ¿Estás seguro cambiar a "Activo"?
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <ButtonOk
            onClick={() => setShowApprove(false)}
            styles={"!w-full m-4 flex justify-center mx-4"}
            classe={"!w-24"}
            children="NO"
          />
          <ButtonOk
            onClick={handleApprove}
            type="ok"
            styles={"!w-full m-4 flex justify-center mx-4"}
            classe={"!w-24"}
            children="SI"
          />
        </div>
      </div>
    </div>
  );
};

export default Active;
