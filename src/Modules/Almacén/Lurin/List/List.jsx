import { Dropdown } from "primereact/dropdown";
import ListPrincipal from "../../../../components/Principal/List/List";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovimientosBySede } from "../../../../redux/modules/Almacen/actions";
import { useCallback, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { useSearchParams } from "react-router-dom";
import DetailLurin from "../Permissions/Detail";
import DeleteMovimientoAlmacen from "../Permissions/DeleteMovimiento";
import EditMovimiento from "../Permissions/EditMovimiento";
import axios from "../../../../api/axios";

const ListLurin = ({
  permissionEdit,
  permissionRead,
  permissionDelete,
  contratos,
  contratos_id,
  contratoSeleccionado,
  setContratoSeleccionado,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const initialMovimiento = searchParams.get("movimiento") || "TODOS";
  const initialContrato =
    contratoSeleccionado || searchParams.get("contrato") || contratos[0] || "";

  const [form, setForm] = useState({
    contrato: initialContrato,
    movimiento: initialMovimiento,
  });

  const contratoId = contratos_id.find(
    (contrato) => contrato.cliente === form.contrato
  );
  useEffect(() => {
    if (contratoSeleccionado) {
      setForm((prev) => ({ ...prev, contrato: contratoSeleccionado }));
    }
  }, [contratoSeleccionado]);

  const recargar = useCallback(
    async (page = 0, limit = 10, search = "") => {
      if (!form.contrato || !form.movimiento) {
        return {
          data: [],
          total: 0,
        };
      }
      const response = await axios.get("/getAllMovimientosBySede", {
        params: {
          contratoId: contratoId._id,
          movimiento: form.movimiento,
          page,
          limit,
          search,
        },
      });
      return {
        data: response.data?.data,
        total: response.data?.total,
      };
    },
    [form.contrato, form.movimiento]
  );

  const seleccionarContrato = (e) => {
    const selected = e.value;
    setForm((prev) => ({ ...prev, contrato: selected }));
    setContratoSeleccionado(selected);
    setSearchParams((prev) => {
      prev.set("select", "Movimientos");
      prev.set("contrato", selected);
      return prev;
    });
    const id = contratos_id.find((c) => c.cliente === selected)?._id;
    if (id) dispatch(getAllMovimientosBySede(id));
  };
  const seleccionarMovimiento = (e) => {
    const selected = e.value;
    setForm((prev) => ({ ...prev, movimiento: selected }));
    setSearchParams((prev) => {
      prev.set("select", "Movimientos");
      prev.set("movimiento", selected);
      return prev;
    });
    recargar(0, 10, selected);
  };

  if (!contratos.length)
    return <div className="p-6">Cargando contratos...</div>;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full relative">
        <div className="flex flex-col gap-4 px-4">
          <Dropdown
            value={form.contrato}
            onChange={seleccionarContrato}
            options={contratos}
            placeholder="Seleccione contrato"
            dropdownIcon="pi pi-sort-down-fill"
            className="absolute top-4 h-11 w-44 mx-4 ml-7 text-center items-center text-base pl-6 z-10 rounded-lg shadow-lg bg-gradient-to-r from-gray-50 to-gray-100"
          />
          <Dropdown
            value={form.movimiento}
            onChange={seleccionarMovimiento}
            options={["INGRESO", "SALIDA", "TODOS"]}
            placeholder="Seleccione Movimiento"
            dropdownIcon="pi pi-sort-down-fill"
            className="absolute top-4 h-11 w-44 mx-4  left-60 text-center items-center text-base pl-6 z-10 rounded-lg shadow-lg bg-gradient-to-r from-gray-50 to-gray-100"
          />
          <ListPrincipal
            DetailItem={DetailLurin}
            EditItem={EditMovimiento}
            DeleteItem={DeleteMovimientoAlmacen}
            permissionEdit={permissionEdit}
            permissionDelete={permissionDelete}
            permissionRead={permissionRead}
            fetchData={recargar}
            reload={recargar}
            key={`${form.contrato}-${form.movimiento}`}
          >
            <Column
              field="correlativa"
              header="Código Interno"
               
            />
            <Column field="movimiento" header="Movimiento" />
            <Column field="contribuyente" header="Contribuyente" />
            <Column field="datosGenerales.fecha" header="Fecha" />
            <Column field="datosGenerales.horaIngreso" header="Hora Ingreso" />
            <Column
              field="datosGenerales.recepcionadoPor"
              header="Recepcionado Por"
            />
            <Column field="numeroDeActa" header="Número de Acta" />
            <Column field="datosGenerales.estadoActa" header="Estado de Acta" />
          </ListPrincipal>
        </div>
      </div>
    </div>
  );
};

export default ListLurin;
