import { useEffect } from "react";
import ListPrincipal from "../../../../components/Principal/List/List";
import DeletePlantillaContrato from "../Permisos/Delete";
import EditPlantillaContrato from "../Permisos/Edit";
import ViewPlantillaContrato from "../Permisos/View";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "primereact/column";
import dayjs from "dayjs";
import { getPlantillasContrato } from "../../../../redux/modules/Recursos Humanos/actions";

const List = ({ permissionEdit, permissionDelete, permissionRead }) => {
  const plantillas = useSelector((state) => state.recursosHumanos.allPlantillasContrato);
  const dispatch = useDispatch();
  useEffect(() => {
    if (plantillas.length === 0) dispatch(getPlantillasContrato());
  }, [dispatch]);
  const formattedPlantillas = plantillas.map((plantilla) => ({
    ...plantilla,
    createdAt: dayjs(plantilla.createdAt).format("DD/MM/YYYY"),
  }));
  return (
    <ListPrincipal
      permissionDelete={permissionDelete}
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      DeleteItem={DeletePlantillaContrato}
      EditItem={EditPlantillaContrato}
      DetailItem={ViewPlantillaContrato}
      content={formattedPlantillas}
      reload={() => dispatch(getPlantillasContrato())}
    >
      <Column
        field="createdAt"
         
        header="Fecha de Subida"
        sortable
      />
      <Column field="tipoContrato" header="Tipo de Contrato" sortable />
      <Column
        field="state"
        header="Estado"
        style={{ justifyItems: "center" }}
        body={(rowData) => {
          const color =
            rowData.state === "ACTIVO" ? " text-green-500 " : " text-red-500 ";

          return (
            <div
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
                shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.state}
            </div>
          );
        }}
        sortable
      />
    </ListPrincipal>
  );
};

export default List;
