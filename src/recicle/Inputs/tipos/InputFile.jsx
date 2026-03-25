import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../redux/actions";

const InputFiles = ({
  label,
  name,
  errorOnclick,
  ancho,
  setForm,
  type,
  toBase64,
  value,
}) => {
  const dispatch = useDispatch();

  const [animation, setAnimation] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [nameFile, setNameFile] = useState("");
  console.log("finelNAME", nameFile);
  // 🎨 estilos
  const styleError = "border-red-500 animate-shake";
  const styleNormal = "border-gray-300";
  const styleConstant =
    "mt-1 px-3 py-2 border rounded-md shadow-sm sm:text-sm focus:outline-none";
  const estilo = `${styleConstant} ${ancho} ${animation ? styleError : styleNormal
    }`;

  // 🔁 error externo
  useEffect(() => {
    if (errorOnclick) {
      setAnimation(true);
      setError(true);
    } else {
      setAnimation(false);
      setError(false);
    }
  }, [errorOnclick]);

  // 🔥 sincronizar preview
  useEffect(() => {
    if (!value) {
      setPreview(null);
      setNameFile("");
      return;
    }

    // 🔹 Caso URL (backend)
    if (typeof value === "string" && value.startsWith("http")) {
      setPreview(value);

      const extractedName = value.split("/").pop();
      setNameFile(extractedName);
      return;
    }

    // 🔹 Caso base64 (NO TOCAR EL NOMBRE)
    if (typeof value === "string") {
      setPreview(`data:image/*;base64,${value}`);
      // ❌ NO setNameFile aquí
      return;
    }

    // 🔹 Caso File
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      setNameFile(value.name);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);
  // 📥 manejar archivo
  const handleChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        setError(true);
        setAnimation(true);
        setErrorMessage("Este campo es obligatorio");
        return;
      }

      setNameFile(file.name);
      setIsLoading(true);

      const validFiles = type || ["image/jpeg", "image/png", "image/jpg"];

      if (!validFiles.includes(file.type)) {
        setError(true);
        setAnimation(true);
        setErrorMessage("Tipo de archivo no permitido");
        setIsLoading(false);
        return;
      }

      // limpiar preview anterior (🔥 FIX MEMORIA)
      if (preview) URL.revokeObjectURL(preview);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (toBase64) {
        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result.split(",")[1];

          setForm((prev) => ({
            ...prev,
            [name]: base64,
          }));

          setIsLoading(false);
          setError(false);
          setAnimation(false);
          setErrorMessage("");
        };

        reader.readAsDataURL(file);
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: file,
        }));

        setIsLoading(false);
        setError(false);
        setAnimation(false);
        setErrorMessage("");
      }

      e.target.value = null; // 🔥 permitir mismo archivo
    } catch (err) {
      dispatch(setMessage("Error al cargar el archivo", "Error"));
      setIsLoading(false);
    }
  };

  // 🗑 eliminar
  const handleDelete = () => {
    if (preview) URL.revokeObjectURL(preview);

    setForm((prev) => ({
      ...prev,
      [name]: null,
    }));

    setPreview(null);
    setNameFile("");
    setError(false);
    setAnimation(false);
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col mx-3">
      {/* LABEL */}
      <label
        className={`text-base font-medium ${error ? "text-red-500" : "text-gray-700"
          }`}
      >
        {label}
      </label>

      {/* 🔘 BOTÓN PERSONALIZADO */}
      {!preview && (
        <label
          className={estilo + ` !p-2.5 flex items-center justify-center gap-4 cursor-pointer
            ${animation ? "animate-shake border border-red-500" : ""}
          `}
        >
          <i className="pi pi-plus"></i>
          Nuevo archivo
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={
              Array.isArray(type)
                ? type.join(",")
                : type || "image/*"
            }
          />
        </label>
      )}

      {/* 📄 PREVIEW */}
      {preview && (
        <div
          className={`${estilo} flex items-center justify-between !p-2.5  w-64`}
        >
          <div className="flex items-center">
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm truncate max-w-[175px]"
            >
              {nameFile}
            </a>

          </div>

          <div className="gap-2 flex mx-1">
            {/* ✏️ reemplazar */}
            <span className={`mx-1 text-green ${isLoading ? "pi pi-spinner pi-spin" : ""}`}
            ></span>
            {!isLoading && (
              <>
                <label className="cursor-pointer pi pi-pencil">
                  <input
                    type="file"
                    accept={
                      Array.isArray(type)
                        ? type.join(",")
                        : type || "image/*"
                    }
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>

                {/* 🗑 eliminar */}
                <button
                  className="pi pi-trash"
                  onClick={handleDelete}
                ></button>
              </>
            )
            }
          </div>
        </div>
      )}
      {/* ERROR */}
      {error && (
        <span className="text-red-500 text-xs mt-1">
          {errorMessage || "Este campo es obligatorio"}
        </span>
      )}
    </div>
  );
};

export default InputFiles;