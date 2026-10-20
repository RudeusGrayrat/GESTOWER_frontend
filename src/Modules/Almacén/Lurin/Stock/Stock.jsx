import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DeleteStock from "../Permissions/DeleteStock";
import DetaiStock from "../Permissions/DetailStock";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

const StockAlmacenLurin = ({
  permissionRead,
  sedeId,
  contratos = [],
}) => {
  const [contratoId, setContratoId] = useState("");
  const [subItem, setSubItem] = useState("TODOS");
  const fetchStock = async (page, limit, search) => {
    try {
      const response = await axios.get("/getStockAlmacen", {
        params: { page, limit, search, sedeId, contratoId: contratoId || undefined, subItem },
      });
      console.log("response stock", response);
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    } catch (error) {
      sendMessage(error.message || "Error traer el stock del almacén", "Error");
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 px-6 py-3">
        <Dropdown value={contratoId} onChange={(event) => setContratoId(event.value)} options={contratos.map((contrato) => ({ label: contrato.cliente, value: contrato._id }))} placeholder="Todos los contratos" showClear className="w-64" />
        <Dropdown value={subItem} onChange={(event) => setSubItem(event.value)} options={["TODOS", "1.1", "1.2", "1.3"]} className="w-40" />
      </div>
      <ListPrincipal
      permissionRead={permissionRead}
      DetailItem={DetaiStock}
      fetchData={fetchStock}
      key={`stock-almacen-lurin-${contratoId}-${subItem}`}
    >
      <Column field="codigoIngreso" header="Codigo de Ingreso" />
      <Column field="numeroDeActa" header="Número de Acta" />
      <Column field="contrato" header="Contrato" />
      <Column field="descripcion" header="Descripción" />
      <Column field="subItem" header="Subítem" />
      <Column field="cantidadTotal" header="Cantidad Total" />
      <Column field="fechaIngreso" header="Fecha de Ingreso" />
      <Column
        field="estado"
        header="Estado"
        style={{
          justifyItems: "center",
        }}
        body={(rowData) => {
          let color = "";
          switch (rowData.estado) {
            case "ACTIVO":
              color = "text-green-500";
              break;
            case "AGOTADO":
              color = "text-red-500";
              break;
            case "PARCIAL":
              color = "text-blue-500";
              break;
            default:
              color = "text-gray-500";
          }

          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                            shadow-inner rounded-xl font-medium  px-5 py-1  ${color} `}
            >
              {rowData.estado}
            </div>
          );
        }}
      />
      </ListPrincipal>
    </div>
  );
};

export default StockAlmacenLurin;
