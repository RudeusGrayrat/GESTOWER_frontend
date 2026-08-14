import { useState } from "react";

const useValidation = (initialFormData) => {
  const [error, setError] = useState({
    name: false,
    lastname: false,
    documentType: false,
    documentNumber: false,
    situacionEspecial: false,
    dateOfBirth: false,
    genre: false,
    civilStatus: false,
    email: false,
    location: {
      departamento: false,
      provincia: false,
      distrito: false,
      direccion: false,
    },
    business: false,
    sede: false,
    charge: false,
    sueldo: false,
    user: false,
    photo: false,
    password: false,
    funcion: false,
    // modules: [
    //   {
    //     name: false,
    //     submodule: {
    //       name: false,
    //       permissions: false,
    //     },
    //   },
    // ],
  });

  // Función de validación
  const validateForm = (formData) => {
    const newError = {
      name: formData.name === "",
      lastname: formData.lastname === "",
      documentType: formData.documentType === "",
      documentNumber: formData.documentNumber === "",
      situacionEspecial: formData.situacionEspecial === "",
      dateOfBirth: formData.dateOfBirth === "",
      genre: formData.genre === "",
      civilStatus: formData.civilStatus === "",
      email: formData.email === "",
      location: {
        departamento: formData.location.departamento === "",
        provincia: formData.location.provincia === "",
        distrito: formData.location.distrito === "",
        direccion: formData.location.direccion === "",
      },
      business: formData.business === "",
      sede: formData.sede === "",
      charge: formData.charge === "",
      sueldo: formData.sueldo === "",
      user: formData.user === "",
      photo: formData.photo === "",
      password: formData.password === "",
      funcion: formData.funcion === "",
      // modules: formData?.modules?.map((module) => ({
      //   name: module?.name === "",
      //   submodule: {
      //     name: module?.submodule?.name === "",
      //     permissions: module?.submodule?.permissions.length === 0,
      //   },
      // })),
    };

    setError(newError);

    // Verifica si el formulario es válido
    const formIsValid = Object.values(newError).every(
      (field) =>
        field === false ||
        Object.values(field).every((subfield) => subfield === false)
    );

    return formIsValid;
  };

  return { error, validateForm };
};

export default useValidation;
