import { useDispatch } from "react-redux";
import { getBoletaDePagos, setMessage } from "../../../../redux/actions";
import { useAuth } from "../../../../context/AuthContext";
import Disapprove from "../../../../components/Principal/Permissions/Disapprove";

const DisapproveBoletaDePago = ({ setShowDisapprove, selected, reload }) => {
  const { updateBoletasDePago } = useAuth();
  const estado = selected.state === "APROBADO" ? "PENDIENTE" : "APROBADO";
  const dispatch = useDispatch();
  const id = selected._id;
  const handleDisapprove = async () => {
    try {
      await updateBoletasDePago({ _id: id, state: estado });
      dispatch(getBoletaDePagos());
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    } finally {
      reload();
    }
  };
  return (
    <Disapprove
      setShowDisapprove={setShowDisapprove}
      estado={selected.state}
      onclick={handleDisapprove}
    />
  );
};
export default DisapproveBoletaDePago;
