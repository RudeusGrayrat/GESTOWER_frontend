import { useDispatch } from "react-redux";
import Approve from "../../../../components/Principal/Permissions/Approve";
import { getBoletaDePagos, setMessage } from "../../../../redux/actions";
import { useAuth } from "../../../../context/AuthContext";

const ApproveBoletaDePago = ({ setShowApprove, selected, reload }) => {
  const { updateBoletasDePago } = useAuth();
  const estado = selected.state === "APROBADO" ? "PENDIENTE" : "APROBADO";
  const dispatch = useDispatch();
  const id = selected._id;
  const handleApprove = async () => {
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
    <Approve
      setShowApprove={setShowApprove}
      estado={selected.state}
      onclick={handleApprove}
    />
  );
};
export default ApproveBoletaDePago;
