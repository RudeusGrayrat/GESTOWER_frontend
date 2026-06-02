import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import BoletaExcel from "./BoletasExcel";
import EnvioWord from "./EnvioPDF";
import { getBusiness } from "../../../../redux/modules/Recursos Humanos/actions";

const ReporteBoletasDePago = () => {
  const [formExcel, setFormExcel] = useState({
    empresa: "TODOS",
    desde: "",
    hasta: "",
  });
  const [formWord, setFormWord] = useState({
    empresa: "",
    desde: "",
    hasta: "",
  });

  function parseDate(dateString) {
    const [month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1);
  }

  const parseDateGuion = (dateString) => {
    const [year, month] = dateString.split("-").map(Number);
    return new Date(year, month - 1);
  };
  const allBoletas = useSelector(
    (state) => state.recursosHumanos.boletaDePagos
  );

  const dispatch = useDispatch();
  const allBusiness = useSelector((state) => state.recursosHumanos.business);

  useEffect(() => {
    if (allBusiness.length === 0) dispatch(getBusiness());
  }, [allBusiness.length, dispatch]);

  return (
    <div>
      <BoletaExcel
        parseDateGuion={parseDateGuion}
        parseDate={parseDate}
        form={formExcel}
        setForm={setFormExcel}
        options={["TODOS", ...allBusiness]}
      />
      <EnvioWord
        allBoletas={allBoletas}
        parseDateGuion={parseDateGuion}
        parseDate={parseDate}
        form={formWord}
        setForm={setFormWord}
        options={allBusiness}
      />
    </div>
  );
};

export default ReporteBoletasDePago;
