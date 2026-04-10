import { useState } from "react";
import { useDispatch } from "react-redux";
import useref from "../../../../recicle/useRef";
import { useAuth } from "../../../../context/AuthContext";
import { getCotizaciones, setMessage } from "../../../../redux/actions";
import FormOne from "../Register/DatosDocumento/FormOne";
import RemoveItemAdd from "../../../../components/RemoveAdd/RemoveItemAdd";
import Item from "../Register/Registros/Item";
import { deepDiff } from "../../../validateEdit";
import ButtonOk from "../../../../recicle/Buttons/Buttons";

const Edit = (props) => {
  const { setShowEdit, client } = props;
  const { patchCotizacion } = useAuth();
  const ref = useref(setShowEdit);
  const dispatch = useDispatch();
  const [edition, setEdition] = useState({
    ...client,
  });

  const comparation = deepDiff(client, edition);

  const upDate = async () => {
    try {
      if (Object.keys(comparation).length === 0) {
        dispatch(setMessage("No se han realizado cambios", "Error"));
      } else {
        const envio = { ...comparation, _id: client._id };
        const response = await patchCotizacion(envio);
        dispatch(getCotizaciones());
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };
  const [errorForm, setErrorForm] = useState(false);
  return (
    <div
      ref={ref}
      className={`w-[70%]  h-[80%] pt-6 bg-white flex flex-col justify-center
         border-stone-500 border shadow-lg fixed top-20 z-40 rounded-xl`}
    >
      <div
        className="overflow-y-auto  px-6 content-center 
        flex-wrap ml-10 mx-6 h-[80%] "
      >
        <h1 className="">CLIENTE</h1>
        <div className=" mt-2 border rounded-md border-slate-300 items-start">
          <FormOne
            setErrorForm={setErrorForm}
            setForm1={setEdition}
            form1={edition}
          />
        </div>
        <div className="min-h-[30%]  border-slate-300  py-3 items-start">
          <h1>REGISTROS</h1>
          <RemoveItemAdd
            ItemComponent={Item}
            estilos=" border rounded-md border-slate-300 pl-6"
            wrap="flex-wrap"
            directory={client.registros}
            setForm={setEdition}
            data="registros"
            setErrorForm={setErrorForm}
          />
        </div>
      </div>

      <div className="flex justify-end p-3">
        <ButtonOk onClick={() => setShowEdit(false)} children="Cancelar" />
        <ButtonOk onClick={() => upDate()} type="ok" children="Editar" />
      </div>
    </div>
  );
};

export default Edit;
