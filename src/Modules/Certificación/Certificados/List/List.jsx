import { Column } from "primereact/column";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCertificados } from "../../../../redux/actions";
import DetailCertificado from "../Permissions/View";

const ListCertificados = ({
  permissionRead,
  permissionEdit,
  permissionDelete,
}) => {
  const dispatch = useDispatch();
  const certificados = useSelector((state) => state?.certificados);
  useEffect(() => {
    if (certificados?.length === 0) {
      dispatch(getCertificados());
    }
  }, [certificados, dispatch]);
  return (
    <ListPrincipal
      permissionRead={permissionRead}
      permissionEdit={permissionEdit}
      permissionDelete={permissionDelete}
      DetailItem={DetailCertificado}
      content={certificados || []}
      sortField="createdAt"
      sortOrder={-1}
      reload={() => dispatch(getCertificados())}
    >
      <Column
        field="name"
         
        header="Nombre"
        sortable
      ></Column>
      <Column field="fecha" header="Fecha" sortable></Column>
    </ListPrincipal>
  );
};

export default ListCertificados;
