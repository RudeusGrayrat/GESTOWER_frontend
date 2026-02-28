import { useDispatch } from "react-redux";
import Delete from "../../../../components/Principal/Permissions/Delete";
import { useAuth } from "../../../../context/AuthContext";
import { getBoletaDePagos, setMessage } from "../../../../redux/actions";

const DeleteBoletaDePagos = ({ setShowDelete, selected, reload }) => {
  const id = selected._id;
  const dispatch = useDispatch();
  const { deleteBoletasDePago } = useAuth();
  const handleDelete = async () => {
    try {
      await deleteBoletasDePago(id);
      dispatch(getBoletaDePagos());
    } catch (error) {
      dispatch(setMessage(error, "Error"));
    } finally {
      reload();
    }
  };
  return <Delete setShowDelete={setShowDelete} onclick={handleDelete} />;
};

export default DeleteBoletaDePagos;
