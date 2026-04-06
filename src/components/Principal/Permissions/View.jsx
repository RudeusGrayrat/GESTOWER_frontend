import ButtonOk from "../../../recicle/Buttons/Buttons";
import PopUp from "../../../recicle/popUps";
import { useLocation, useNavigate } from "react-router-dom";
const Details = (props) => {
  const { setShowDetail, children, estilos } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // const detailsRef = useref(setShowDetail);
  const handleCloseDetail = () => {
    setShowDetail(false);
    navigate(location.pathname);
  };

  return (
    <div className="w-screen pl-20 h-screen fixed top-0 right-0 z-40 flex items-center justify-center bg-black bg-opacity-50">

      <div
        // ref={detailsRef}

        className={`w-[85%] max-h-[90%] bg-gradient-to-tr  absolute  from-gray-50 to-gray-100  border-gray-100 blur-0 border shadow-2xl  z-40 rounded-xl p-10`}

      >

        <div className="flex justify-end fixed  -top-8 -right-8 rounded-b-xl">
          <button
            onClick={handleCloseDetail}
            className=" h-20 w-20 text-3xl text-white rounded-full bg-gradient-to-tr
          from-[#2b5993] to-[#418fda] transition-colors"
          >
            X
          </button>
        </div>
        <div className="h-full m-1 w-full  gap-8 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Details;
