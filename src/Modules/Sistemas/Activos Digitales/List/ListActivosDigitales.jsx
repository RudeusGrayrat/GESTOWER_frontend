import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ListActivosDigitales = ({
  permissionRead,
  permissionEdit,
  permissionApprove,
  permissionDisapprove,
}) => {
  //   const activosDigitales = useSelector((state) => state.sistemas.activosDigitales);
  const activosDigitales = [
    {
      name: "ESET HOME SECURITY",
      tipo: "ANTIVIRUS",
      clave: "ES3T-XXYY-ZZ11-WW22",
      cantidad_dispositivos: 10,
      fecha_inicio: "2025-04-01",
      fecha_vencimiento: "2026-04-01",
      renovacion_automatica: false,
      costo: 350,
      moneda: "PEN",
      proveedor: "Licencias SAC",
      state: "ACTIVO",
    },
    {
      name: "ESET HOME SECURITY",
      tipo: "ANTIVIRUS",
      clave: "ES3T-XXYY-ZZ11-WW22",
      cantidad_dispositivos: 10,
      fecha_inicio: "2025-04-01",
      fecha_vencimiento: "2026-04-01",
      renovacion_automatica: false,
      costo: 350,
      moneda: "PEN",
      proveedor: "Licencias SAC",
      state: "ACTIVO",
    },
    {
      name: "ESET HOME SECURITY",
      tipo: "ANTIVIRUS",
      clave: "ES3T-XXYY-ZZ11-WW22",
      cantidad_dispositivos: 10,
      fecha_inicio: "2025-04-01",
      fecha_vencimiento: "2026-04-01",
      renovacion_automatica: false,
      costo: 350,
      moneda: "PEN",
      proveedor: "Licencias SAC",
      state: "INACTIVO",
    },
    {
      name: "ESET HOME SECURITY",
      tipo: "ANTIVIRUS",
      clave: "ES3T-XXYY-ZZ11-WW22",
      cantidad_dispositivos: 10,
      fecha_inicio: "2025-04-01",
      fecha_vencimiento: "2026-04-01",
      renovacion_automatica: false,
      costo: 350,
      moneda: "PEN",
      proveedor: "Licencias SAC",
      state: "INACTIVO",
    },
  ];
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     if (activosDigitales.length === 0) dispatch(getActivosDigitales());
  //   }, [dispatch]);

  return (
    <ListPrincipal
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      //   ApproveItem={Active}
      //   DisapproveItem={Inactive}
      //   EditItem={EditEmployee}
      //   DetailItem={DetailEmployee}
      content={activosDigitales}
      //   reload={() => dispatch(getEmployees())}
    >
      <Column
        field="name"
        header="name"
        sortable
         
      />
      <Column field="tipo" header="Tipo" sortable />
      <Column field="clave" header="Clave" sortable />
      <Column field="cantidad_dispositivos" header="Cantidad" sortable />
      <Column field="fecha_inicio" header="Fecha Inicio" sortable />
      <Column field="fecha_vencimiento" header="Fecha Vencimiento" sortable />
      <Column field="renovacion_automatica" header="Renovación" sortable />
      <Column field="costo" header="Costo" sortable />
      <Column field="moneda" header="Moneda" sortable />
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

export default ListActivosDigitales;
