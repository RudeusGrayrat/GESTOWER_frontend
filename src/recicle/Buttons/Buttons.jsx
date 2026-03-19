import React from "react";

const ButtonOk = ({
  type,
  children,
  onClick,
  styles,
  classe,
  stylesButton,
  ...OtherProps
}) => {
  const color =
    type === "ok"
      ? "bg-gradient-to-r from-[#2b5993] to-[#306fa8] hover:scale-105 transition-all duration-300  hover:from-[#418fda] hover:to-[#418fda]"
      : "bg-gradient-to-r from-[#FF0000] to-[#FF382E] hover:scale-105 transition-all duration-300  hover:from-[#FF382E] hover:to-[#FF382E] hover:bg-red-500";
  return (
    <div className={` ${styles ? styles : "m-4 px-8  mx-4 "} `}>
      <button
        onClick={onClick}
        className={` ${color}  text-white ${classe} px-4 py-2 
          rounded-md`}
        {...OtherProps}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonOk;
