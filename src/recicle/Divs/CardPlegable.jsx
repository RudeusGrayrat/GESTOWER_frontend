import { useState } from "react";

const CardPlegable = ({ title, children, estiloDiv, estiloButton, estiloContent }) => {
  const [show, setShow] = useState(true);
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <div className={`${estiloDiv} shadow-md bg-[#f3f3f3a1] rounded-lg mr-4 m-4`}>
      <button
        type="ok"
        className={`my-1 ${estiloButton} bg-[#ffffff] text-start shadow-md p-3 mb-6 rounded-lg w-full font-semibold text-lg pl-6`}
        onClick={() => handleShow()}
      >
        {title}
      </button>
      <div className={`mx-6 pb-6 ${estiloContent}`}>{show && children}</div>
    </div>
  );
};

export default CardPlegable;
