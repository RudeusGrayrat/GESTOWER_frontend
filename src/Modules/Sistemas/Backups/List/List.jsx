import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";

const ListBackups = ({
  permissionRead,
  permissionEdit,
  permissionApprove,
  permissionDisapprove,
}) => {
  const backups = [
    {
      name: "MIGUEL ANGEL",
      lastname: "NICOLAS CAMPOMANES",
      entrega: "00-00-0000",
      mes: "Enero",
      estado: "PENDIENTE",
      año: "2024",
    },
    {
      name: "JUAN PABLO",
      lastname: "GARCIA PEREZ",
      entrega: "2024-02-01",
      mes: "Febrero",
      estado: "ENTREGADO",
      año: "2024",
    },
    {
      name: "MARIA JOSE",
      lastname: "LOPEZ GUTIERREZ",
      entrega: "00-00-0000",
      mes: "Marzo",
      estado: "PENDIENTE",
      año: "2025",
    },
    {
      name: "CARLOS ALBERTO",
      lastname: "MENDOZA RAMIREZ",
      entrega: "2024-04-01",
      mes: "Abril",
      estado: "ENTREGADO",
      año: "2025",
    },
  ];
  return (
    <ListPrincipal
      permissionApprove={permissionApprove}
      permissionDisapprove={permissionDisapprove}
      permissionEdit={permissionEdit}
      permissionRead={permissionRead}
      content={backups}
    >
      <Column field="name" header="Nombre"  />
      <Column field="lastname" header="Apellido"  />
      <Column field="entrega" header="Fecha de Entrega"  />
      <Column field="mes" header="Mes"  />
      <Column field="año" header="Año"  />
      <Column
        field="estado"
        header="Estado"
        body={(rowData) => {
          const color =
            rowData.estado === "ENTREGADO"
              ? " text-green-500 "
              : " text-red-500 ";
          return (
            <span
              className={`text-center bg-gradient-to-tr from-white to-gray-100 
          shadow-inner rounded-xl font-semibold  px-5 py-1  ${color} `}
            >
              {rowData.estado}
            </span>
          );
        }}
        
      />
    </ListPrincipal>
  );
};

export default ListBackups;
