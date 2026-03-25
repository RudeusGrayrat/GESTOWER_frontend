import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions";

const useSendMessage = () => {
  const dispatch = useDispatch();

  return (message, type, loading) => {
    dispatch(setMessage(message, type, loading));
  };
};

export default useSendMessage;
