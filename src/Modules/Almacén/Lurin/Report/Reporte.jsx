import Ingresos from "./Ingreso";
import Movimientos from "./Movimientos";
import Salidas from "./Salida";
import Stock from "./Stock";
const {
  VITE_REPORTE_STOCK_LURIN
} = import.meta.env;
const Reporte = ({ contratos, contratos_id, sedeId }) => {
  const plantillaSegura = VITE_REPORTE_STOCK_LURIN;
  return (
    <div className="px-1 gap-1  flex flex-col">
      <Stock
        contratos={contratos}
        contratosId={contratos_id}
        plantilla={plantillaSegura}
        sedeId={sedeId}
      />
      <Movimientos contratos={contratos} contratosId={contratos_id} />
      <Ingresos contratos={contratos} contratosId={contratos_id} />
      <Salidas contratos={contratos} contratosId={contratos_id} />
    </div>
  );
};

export default Reporte;
