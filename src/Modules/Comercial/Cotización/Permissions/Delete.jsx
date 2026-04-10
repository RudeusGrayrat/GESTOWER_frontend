import { useDispatch } from "react-redux";
import { getCotizaciones } from "../../../../redux/actions";
import useref from "../../../../recicle/useRef";
import { useAuth } from "../../../../context/AuthContext";
import ButtonOk from "../../../../recicle/Buttons/Buttons";

const Delete = ({ setShowDelete, cotizacion }) => {
  const id = cotizacion._id;
  const ref = useref(setShowDelete);
  const { deleteCotizacion } = useAuth();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await deleteCotizacion(id);
      dispatch(getCotizaciones());
    } catch (error) {
      console.error("Failed to delete cotizacion:", error);
    }
  };
  return (
    <div
      ref={ref}
      className="fixed flex top-80 z-40 
         "
    >
      <div className="flex flex-col  bg-white p-8 border-2 rounded-lg border-red-300 shadow-lg ">
        <div className="">
          <h1 className="p-4 font-bold text-red-600 text-center text-5xl">
            ⚠ Alerta! ⚠
          </h1>
          <h1 className="p-4 text-center text-xl">
            ¿Está seguro que desea eliminarlo?
          </h1>
        </div>
        <div className="flex justify-center">
          <ButtonOk onClick={() => setShowDelete(false)} children="NO" />
          <ButtonOk onClick={handleDelete} type="ok" children="SI" />
        </div>
      </div>
    </div>
  );
};

export default Delete;
