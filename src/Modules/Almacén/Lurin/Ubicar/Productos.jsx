import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const ProductosUbicacion = ({ set, error, initialData }) => {
  const sendMessage = useSendMessage();

  const [data, setData] = useState({
    cantidad: "",
    descripcion: "",
    unidadDeMedida: "UNIDAD",
    subItem: "",
  });

  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [showSearch, setShowSearch] = useState(true);

  // ✅ Solo carga initialData una vez al montar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const filledData = {
        productoId:
          typeof initialData.productoId === "object"
            ? initialData.productoId._id
            : initialData.productoId,

        cantidad: initialData.cantidad || "",
        descripcion:
          initialData.descripcion || initialData.productoId?.descripcion || "",
        unidadDeMedida:
          initialData.unidadDeMedida ||
          initialData.productoId?.unidadDeMedida ||
          "UNIDAD",
        subItem:
          initialData.subItem ||
          initialData.productoId?.subItem ||
          "",
      };


      setData(filledData);

      if (filledData.descripcion) {
        setShowSearch(false);
      }
    }
    // ⛔ ojo: sin dependencia [initialData]
  }, []);

  // 🔎 Buscar productos
  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) {
      setOptions([]);
      return;
    }
    try {
      const response = await axios.get(`/getStockAlmacen`, {
        params: { search: value },
      });
      setOptions(response.data.data || []);
    } catch (error) {
      sendMessage(error.message || "Error buscando productos", "Error");
    }
  };

  // ✅ Selección de producto
  const handleSelect = (producto) => {
    const newData = {
      productoId: producto.productoId._id,
      descripcion: producto.productoId.descripcion,
      unidadDeMedida: producto.productoId.unidadDeMedida || "UNIDAD",
      subItem: producto.productoId.subItem || "",
      cantidad: producto.cantidadDisponible || "0",
    };

    setData(newData); // mantiene inputs actualizados
    setShowSearch(false);
    setOptions([]);
    setSearch("");

    set({
      productoId: newData.productoId,
      cantidad: newData.cantidad,
      cantidadDisponible: newData.cantidad,
      descripcion: newData.descripcion,
      unidadDeMedida: newData.unidadDeMedida,
      subItem: newData.subItem,
    });

  };

  // ✏️ Cambios manuales en inputs
  const handleInputChange = (name, value) => {
    const newData = { ...data, [name]: value };
    setData(newData);

    // ⬇️ SIEMPRE enviar el objeto completo
    set({
      productoId: newData.productoId,
      cantidad: newData.cantidad,
      descripcion: newData.descripcion,
      unidadDeMedida: newData.unidadDeMedida,
      subItem: newData.subItem,
    });
  };


  // 🔹 Adaptador para que funcione con tu Input
  const adaptSetForm = (name) => (updater) => {
    if (typeof updater === "function") {
      // caso (prev)=>({...prev, [name]: value})
      const newValue = updater({ ...data })[name];
      handleInputChange(name, newValue);
    } else {
      // caso value directo (multiSelect, etc.)
      handleInputChange(name, updater);
    }
  };

  return (
    <div className="w-full flex flex-wrap p-2 relative">
      {showSearch ? (
        <div className="w-full mb-2 p-2 relative">
          <label className="text-base font-medium text-gray-700">
            Buscar por Descripción
          </label>
          <input
            type="text"
            value={search}
            placeholder="Escribe para buscar..."
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-1 py-2 border px-3 w-[100%] !text-base rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {options.length > 0 && (
            <ul className="absolute top-full left-0 w-full border bg-white rounded-md shadow max-h-40 overflow-y-auto z-50">
              {options.map((producto) => (
                <li
                  key={producto?.productoId?._id || producto?.movimientoId}
                  onClick={() => handleSelect(producto)}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {producto.productoId.descripcion} (
                  {producto.productoId.unidadDeMedida}) -{" "}
                  {producto.productoId.subItem}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <Input
            label="Descripción"
            name="descripcion"
            value={data.descripcion}
            setForm={() => { }}
            errorOnclick={error?.descripcion}
            disabled
          />

          <Input
            label="Unidad de Medida"
            name="unidadDeMedida"
            type="select"
            value={data.unidadDeMedida}
            setForm={() => { }}
            disabled
            errorOnclick={error?.unidadDeMedida}
          />

          <Input
            label="Sub Item"
            name="subItem"
            type="select"
            options={["1.1", "1.2", "1.3"]}
            value={data.subItem}
            setForm={() => { }}
            errorOnclick={error?.subItem}
            disabled
          />

          <Input
            label="Cantidad"
            name="cantidad"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            value={data.cantidad}
            setForm={adaptSetForm("cantidad")}
            errorOnclick={error?.cantidad}
          />
        </>
      )}
    </div>
  );
};

export default ProductosUbicacion;
