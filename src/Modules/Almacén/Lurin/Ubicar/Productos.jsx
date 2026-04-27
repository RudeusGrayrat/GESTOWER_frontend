import { useEffect, useState } from "react";
import Input from "../../../../recicle/Inputs/Inputs";
import axios from "../../../../api/axios";
import useSendMessage from "../../../../recicle/senMessage";

const ProductosUbicacion = ({ set, error, initialData }) => {
  const sendMessage = useSendMessage();

  const [data, setData] = useState({
    bienId: "",
    cantidad: "", // Cantidad en esta ubicación específica
    cantidadDisponible: 0, // Lo que hay en el "aire" (Stock)
    descripcion: "",
    unidadDeMedida: "UNIDAD",
    subItem: "",
    movimientoId: ""
  });

  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const filledData = {
        bienId: initialData.bienId?._id || initialData.bienId,
        cantidad: initialData.cantidad || "",
        // Aquí asumimos que si ya está guardado, la info viene del populate de Ubicación
        descripcion: initialData.descripcion || initialData.bienId?.descripcion || "",
        unidadDeMedida: initialData.bienId?.unidadDeMedida || "UNIDAD",
        subItem: initialData.bienId?.subItem || "",
        movimientoId: initialData.movimientoId?._id || initialData.movimientoId
      };
      setData(filledData);
      if (filledData.descripcion) setShowSearch(false);
    }
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) return setOptions([]);
    try {
      // Buscamos en la tabla de Stock
      const response = await axios.get(`/getStockAlmacen`, { params: { search: value } });
      setOptions(response.data.data || []);
    } catch (error) {
      sendMessage("Error buscando en stock", "Error");
    }
  };

  const handleSelect = (stockItem) => {
    const newData = {
      bienId: stockItem.bienId._id,
      movimientoId: stockItem.movimientoId,
      descripcion: stockItem.descripcion,
      unidadDeMedida: stockItem.bienId.unidadDeMedida || "UNIDAD",
      subItem: stockItem.bienId.subItem || "",
      cantidadDisponible: stockItem.cantidadDisponible, // Para mostrar al usuario el límite
      cantidad: "" // Empieza vacío para que el usuario digite
    };

    setData(newData);
    setShowSearch(false);
    setOptions([]);
    set({ ...newData });
  };

  const handleInputChange = (name, value) => {
    const newData = { ...data, [name]: value };
    setData(newData);
    set(newData);
  };

  return (
    <div className="w-full flex flex-wrap px-2 relative ">
      {showSearch ? (
        <div className="w-full mb-2 p-2 relative">
          <label className="text-base font-medium text-gray-700">Buscar Bien en Stock</label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-1 py-2 border px-3 w-full rounded-md focus:ring-sky-500"
            placeholder="Buscar por descripción..."
          />
          {options.length > 0 && (
            <ul className="absolute top-full left-0 w-full border bg-white rounded-md shadow-2xl z-50 max-h-48 overflow-y-auto">
              {options.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer text-sm"
                >
                  {item.descripcion} | Disp: <strong>{item.cantidadDisponible}</strong> | Mov: {item.movimientoId.substring(0, 8)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input label="Descripción" value={data.descripcion} disabled />
            <Input label="Sub Item" value={data.subItem} disabled />
            {/* Campo Informativo: No se toca */}
            <Input
              label="Disponible en Stock"
              value={data.cantidadDisponible}
              disabled
              classe="bg-yellow-50 font-bold"
            />
            {/* Campo Editable: Cuánto vas a meter a esta sección */}
            <Input
              label="Cant. a Ubicar"
              name="cantidad"
              type="number"
              value={data.cantidad}
              setForm={(name, val) => handleInputChange("cantidad", val)}
              errorOnclick={error?.cantidad}
            />
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="text-xs text-red-500 mt-2 hover:underline"
          >
            Cambiar producto
          </button>
        </>
      )}
    </div>
  );
};

export default ProductosUbicacion;