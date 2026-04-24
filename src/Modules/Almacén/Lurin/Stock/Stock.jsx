import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import axios from "../../../../api/axios";
import DeleteStock from "../Permissions/DeleteStock";
import DetaiStock from "../Permissions/DetailStock";

const StockAlmacenLurin = ({
  permissionRead,
  permissionEdit,
  // permissionDelete,
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
      permissionEdit={permissionEdit}
      // permissionDelete={permissionDelete}
      DetailItem={DetaiStock}
      DeleteItem={DeleteStock}
      fetchData={fetchStock}
    >
      <Column
        field="movimientoId.numeroDeActa"
        header="Numero de Acta"
      ></Column>
      <Column field="contratoId.cliente" header="Contrato"/>
      <Column field="productoId.descripcion" header="Descripción del Bien"></Column>
      <Column field="cantidadTotal" header="Cantidad"></Column>
      <Column field="productoId.unidadDeMedida" header="Unidad de Medida"></Column>
    </ListPrincipal>
  );
};

export default StockAlmacenLurin;
