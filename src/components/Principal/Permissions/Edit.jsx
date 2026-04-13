import { useRef } from "react";
import ButtonOk from "../../../recicle/Buttons/Buttons";

const Edit = ({ setShowEdit, children, upDate }) => {
  const containerRef = useRef(null);
  return (
    <div className="w-screen pl-20 h-screen fixed top-0 right-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div ref={containerRef} className="relative min-w-[80%] max-w-[90%]  max-h-[90%] min-h-[50%] flex flex-col justify-between bg-white rounded-xl border-gray-100 border shadow-2xl ">

        <div className=" flex flex-col space-y-4 p-2 overflow-y-auto">
          {children}
        </div>

        <div className="flex justify-end border-t ">
          <ButtonOk
            onClick={() => setShowEdit(false)}
            classe="w-32"
            children="Cancelar"
          />
          <ButtonOk onClick={upDate} type="ok" classe="w-32" children="Editar" />
        </div>
      </div>
    </div>
  );
};

export default Edit;
