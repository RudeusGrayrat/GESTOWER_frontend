import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DeleteStock from "../Permissions/DeleteStock";
import DetaiStock from "../Permissions/DetailStock";

const StockAlmacenLurin = ({
  permissionRead,
}) => {
  const fetchStock = async (page, limit, search) => {
    try {
      const response = await axios.get("/getStockAlmacen", {
        params: { page, limit, search },
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
    <ListPrincipal
      permissionRead={permissionRead}
      DetailItem={DetaiStock}
      fetchData={fetchStock}
      key={"stock-almacen-lurin"}
    >
      <Column field="correlativaActa" header="Correlativa Manifiesto" />
      <Column field="numeroDeActa" header="Número de Acta" />
      <Column field="contrato" header="Contrato" />
      <Column field="descripcion" header="Descripción" />
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
  );
};

export default StockAlmacenLurin;
