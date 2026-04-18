// src/Modules/Certificación/Manifiestos/Permissions/Detail.jsx
import { useEffect, useState } from "react";
import Details from "../../../../components/Principal/Permissions/View";
import documentoCloudinary from "../../../../api/cloudinaryDocument";
import ButtonOk from "../../../../recicle/Buttons/Buttons";
import axios from "../../../../api/axios";
import { limpiarPlantilla } from "./LimpiarPlantilla";
import renderManifiesto from "./RenderManifiesto";
import useSendMessage from "../../../../recicle/senMessage";
import dayjs from "dayjs";


const DetailManifiesto = ({ setShowDetail, selected }) => {
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState(null);
  const sendMessage = useSendMessage();

  // Nombre dinámico del archivo
  const fileName = `${selected?.numeroManifiesto || 'Reporte'}_${selected?.transporte?.fechaRecepcion?.replace(/\//g, "-") || ''}`;

  useEffect(() => {
    const fetchPdf = async () => {
      if (!selected) return;

      setLoading(true);
      setPdfBlob(null);
      const safe = (value) => {
        if (value === undefined || value === null) return "";
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value ? 'X' : '';
        return String(value);
      };
      const check = (condition) => condition ? 'X' : '';
      const fechaFormat = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY") : "";

      // Extraer referencias pobladas (asumiendo que vienen con populate)
      const generador = selected.generadorId || {};
      const planta = selected.planta || {};
      const responsableGestion = selected.responsableGestion || {};
      const plantaUbigeo = planta.ubigeoId || {};
      const transportista = selected.transportistaId || {};
      const transportistaUbigeo = transportista.ubigeoId || {};
      const destinoFinal = selected.destinoFinal || {};
      const destino = selected.destinoId || {};
      const destinoUbigeo = destino.ubigeoId || {};

      // Datos principales
      const residuo = selected.residuo || {};
      const peligrosidad = selected.peligrosidad || {};
      const transporte = selected.transporte || {};
      const referendoEntrega = selected.referendoEntrega || {};
      const referendoRecepcion = selected.referendoRecepcion || {};
      const otrosManejos = selected.otrosManejos || {}; // OBJETO
      const otrasObligaciones = selected.otrasObligaciones || {};

      // Contingencias (si existen en transportista)
      const contingencias = transportista.contingencias || {};

      const dataEnviar = {
        // ===== ENCABEZADO =====
        numero_manifiesto: safe(selected.numeroManifiesto),
        año: safe(selected.año),
        mes: safe(selected.mes ? selected.mes.toUpperCase() : ""),

        // ===== GENERADOR =====
        razon_social_generador: safe(generador.razonSocial),
        ruc_generador: safe(generador.ruc),
        correo_generador: safe(generador.correoElectronico),
        telefono_generador: safe(generador.telefono),
        representante_legal_generador: safe(generador.representanteLegal),
        dni_representante_generador: safe(generador.dniRepresentante),

        // ===== PLANTA =====
        denominacion_planta: safe(planta.denominacion),
        tipo_planta: safe(planta.tipoPlanta),
        direccion_planta: safe(planta.direccion),
        ubigeo_planta: safe(plantaUbigeo.codigo),
        distrito: safe(plantaUbigeo.distrito),
        provincia: safe(plantaUbigeo.provincia),
        departamento: safe(plantaUbigeo.departamento),
        coordenada_norte: safe(planta.coordenadasUtm?.norte),
        coordenada_este: safe(planta.coordenadasUtm?.este),
        coordenada_zona: safe(planta.coordenadasUtm?.zona),
        actividad_economica: safe(planta.actividadEconomica),
        sector: safe(planta.sector),
        responsable_gestion: safe(responsableGestion?.nombreResponsable),
        cargo_responsable: safe(responsableGestion?.cargoResponsable),
        dni_responsable: safe(responsableGestion?.dniResponsable),
        correo_responsable: safe(responsableGestion?.correoResponsable),
        telefono_responsable: safe(responsableGestion?.telefonoResponsable),

        // ===== IGA =====
        tiene_iga_si: check(planta.tieneIga === true),
        tiene_iga_no: check(planta.tieneIga === false || planta.tieneIga === undefined || planta.tieneIga === null),
        institucion_aprueba: safe(planta.institucionApruebaIga),
        fecha_aprobacion_iga: fechaFormat(planta.fechaAprobacionIga),
        numero_resolucion: safe(planta.numeroResolucionIga),

        // ===== RESIDUO =====
        descripcion_residuo: safe(residuo.descripcion),
        cantidad_total: safe(residuo.cantidadTotal),
        estado_solido: check(residuo.estadoFisico === 'SOLIDO'),
        estado_semisolido: check(residuo.estadoFisico === 'SEMISOLIDO'),
        estado_liquido: check(residuo.estadoFisico === 'LIQUIDO'),
        estado_gas: check(residuo.estadoFisico === 'GAS'),
        tipo_recipiente: safe(residuo.tipoRecipiente),
        material_recipiente: safe(residuo.materialRecipiente),
        numero_recipientes: safe(residuo.numeroRecipientes || 1),

        // ===== BASILEA =====
        basilea_a1: check(residuo.codigoBasilea === 'A1'),
        basilea_a2: check(residuo.codigoBasilea === 'A2'),
        basilea_a3: check(residuo.codigoBasilea === 'A3'),
        basilea_a4: check(residuo.codigoBasilea === 'A4'),
        subcodigo_basilea: safe(residuo.subcodigoBasilea),
        informacion_adicional: safe(residuo.informacionAdicional),

        // ===== PELIGROSIDAD =====
        explosivos: check(peligrosidad.explosivos),
        oxidantes: check(peligrosidad.oxidantes),
        gases_toxicos: check(peligrosidad.gasesToxicos),
        liquidos_inflamables: check(peligrosidad.liquidosInflamables),
        peroxidos_organicos: check(peligrosidad.peroxidosOrganicos),
        toxicos_cronicos: check(peligrosidad.toxicosCronicos),
        solidos_inflamables: check(peligrosidad.solidosInflamables),
        toxicos_agudos: check(peligrosidad.toxicosAgudos),
        ecotoxicos: check(peligrosidad.ecotoxicos),
        combustion_espontanea: check(peligrosidad.combustionEspontanea),
        sustancias_infecciosas: check(peligrosidad.sustanciasInfecciosas),
        sustancias_secundarias: check(peligrosidad.sustanciasSecundarias),
        gases_inflamables_agua: check(peligrosidad.gasesInflamablesAgua),
        corrosivos: check(peligrosidad.corrosivos),
        otros_peligros: safe(peligrosidad.otros),
        otros_otros_peligros: check(peligrosidad.otros && peligrosidad.otros !== ''),

        // ===== TRANSPORTISTA =====
        razon_social_transportista: safe(transportista.razonSocial),
        ruc_transportista: safe(transportista.ruc),
        registro_eors: safe(transportista.registroEors),
        autorizacion_municipal: safe(transportista.autorizacionMunicipal),
        documento_ruta: safe(transportista.documentoRuta),
        direccion_transportista: safe(transportista.direccion),
        distrito_transportista: safe(transportistaUbigeo.distrito),
        provincia_transportista: safe(transportistaUbigeo.provincia),
        departamento_transportista: safe(transportistaUbigeo.departamento),
        correo_transportista: safe(transportista.correoElectronico),
        telefono_transportista: safe(transportista.telefono),
        representante_legal_transportista: safe(transportista.representanteLegal?.nombre),
        dni_representante_transportista: safe(transportista.representanteLegal?.dni),
        responsable_tecnico_transportista: safe(transportista.responsableTecnico?.nombre),
        numero_colegiatura: safe(transportista.responsableTecnico?.numeroColegiatura),

        // ===== DATOS DEL VIAJE =====
        nombre_conductor: safe(transporte.nombreConductor),
        tipo_vehiculo: safe(transporte.tipoVehiculo),
        placa_vehiculo: safe(transporte.placaVehiculo),
        fecha_recepcion: fechaFormat(transporte.fechaRecepcion),
        cantidad_recibida: safe(transporte.cantidadRecibida),
        observaciones_transporte: safe(transporte.observaciones),

        // ===== REFERENDO ENTREGA =====
        nombre_generador_firma: safe(referendoEntrega.generadorResponsableManejo),
        firma_generador: safe(referendoEntrega.firmaGenerador),
        nombre_transportista_firma: safe(referendoEntrega.responsableEors),
        firma_transportista: safe(referendoEntrega.firmaResponsableEors),
        dni_transportista_firma: safe(referendoEntrega.dniResponsableEors),
        cargo_transportista_firma: safe(referendoEntrega.cargoResponsableEors),
        fecha_hora_entrega: fechaFormat(referendoEntrega.fechaHora),

        // ===== DESTINO (tipo de manejo) =====
        tratamiento: check(destinoFinal.tipoManejo === 'TRATAMIENTO'),
        valorizacion: check((destinoFinal.tipoManejo === "VALORIZACIÓN" || destinoFinal.tipoManejo === "VALORIZACION")),
        disposicion_final: check(destinoFinal.tipoManejo === 'DISPOSICION FINAL'),

        razon_social_destino: safe(destino.razonSocial),
        ruc_destino: safe(destino.ruc),
        codigo_registro_eors_destino: safe(destino.codigoRegistroEors),
        autorizacion_municipal_destino: safe(destino.autorizacionMunicipal),
        direccion_destino: safe(destino.direccion),
        distrito_destino: safe(destinoUbigeo.distrito),
        provincia_destino: safe(destinoUbigeo.provincia),
        departamento_destino: safe(destinoUbigeo.departamento),
        correo_destino: safe(destino.correoElectronico),
        telefono_destino: safe(destino.telefono),
        representante_legal_destino: safe(destino.representanteLegal?.nombre),
        dni_representante_destino: safe(destino.representanteLegal?.dni),
        responsable_tecnico_destino: safe(destino.responsableTecnico?.nombre),
        numero_colegiatura_destino: safe(destino.responsableTecnico?.numeroColegiatura),
        cantidad_entregada: safe(destinoFinal.cantidadEntregada),
        observaciones_destino: safe(destinoFinal.observaciones),

        // ===== REFERENDO RECEPCIÓN =====
        nombre_destino_firma: safe(referendoRecepcion.responsableEorsDestino),
        firma_destino: safe(referendoRecepcion.firmaGenerador), // el campo se llama firmaGenerador en el modelo
        dni_destino_firma: safe(referendoRecepcion.dniResponsableEorsDestino),
        cargo_destino_firma: safe(referendoRecepcion.cargoResponsableEorsDestino),
        fecha_hora_recepcion: fechaFormat(referendoRecepcion.fechaHora),

        // ===== 3.3 OTROS (objeto otrosManejos) =====
        otros_comercializacion: check(otrosManejos.comercializacion),
        otros_exportacion: check(otrosManejos.exportacion),
        otros_otro: check(otrosManejos.otro),
        razon_social_receptor: safe(otrosManejos.razonSocialReceptor),
        ruc_receptor: safe(otrosManejos.rucReceptor),
        correo_receptor: safe(otrosManejos.correoReceptor),
        telefono_receptor: safe(otrosManejos.telefonoReceptor),
        tipo_manejo_otro: safe(otrosManejos.tipoManejo),
        direccion_destino_otro: safe(otrosManejos.direccionDestino),
        documento_aprueba: safe(otrosManejos.documentoAprueba),

        // ===== CONTINGENCIAS (desde transportista) =====
        derrame: safe(contingencias.derrame),
        infiltracion: safe(contingencias.infiltracion),
        incendio: safe(contingencias.incendio),
        explosion: safe(contingencias.explosion),
        otros_accidentes: safe(contingencias.otros),

        // ===== OTRAS OBLIGACIONES (antes "devolución") =====
        nombre_representante_eors: safe(otrasObligaciones.representanteEors),
        firma_representante_eors: safe(otrasObligaciones.firmaRepresentanteEors),
        dni_representante_eors: safe(otrasObligaciones.dniRepresentanteEors),
        cargo_representante_eors: safe(otrasObligaciones.cargoRepresentanteEors),
        nombre_responsable_generador: safe(otrasObligaciones.generadorResponsableManejo),
        firma_responsable_generador: safe(otrasObligaciones.firmaGeneradorResponsableManejo),
        dni_responsable_generador: safe(otrasObligaciones.dniGeneradorResponsableManejo),
        cargo_responsable_generador: safe(otrasObligaciones.cargoGeneradorResponsableManejo),
        fecha_devolucion: fechaFormat(otrasObligaciones.fecha),
        hora_devolucion: safe(otrasObligaciones.hora),

        missingKey: "N/A"
      };

      try {
        // Hacemos la petición al backend para que genere el PDF con LibreOffice
        const response = await axios.get(`/certificaciones/getpdfManifiesto/${selected._id}`, {
          responseType: 'blob', // CRÍTICO: Recibir el PDF como binario
          params: {
            data: dataEnviar
          }
        });

        // Guardamos el archivo en el estado (como hacías con fileGenerated)
        setPdfBlob(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el PDF:", error);
        sendMessage("Error al generar la vista previa del PDF", "Error");
        setLoading(false);
      }
    };

    fetchPdf();
  }, [selected]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Limpieza inmediata
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handlePreview = () => {
    if (pdfBlob) {
      const fileURL = window.URL.createObjectURL(pdfBlob);
      window.open(fileURL, '_blank');
      // Nota: No revocamos la URL inmediatamente para que la pestaña pueda cargarla
    }
  };
  return (
    <Details setShowDetail={setShowDetail} title={`Manifiesto ${selected?.numeroManifiesto || ''}`}>
      {!loading && pdfBlob ? (
        <div className="flex gap-8 mt-6 ml-10">
          {/* BOTÓN VISUALIZAR */}
          <div
            onClick={handlePreview}
            className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] w-60 p-2.5 text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
          >
            <span>Visualizar PDF</span>
            <span className="ml-2 pi pi-eye"></span>
          </div>

          {/* BOTÓN DESCARGAR */}
          <div
            onClick={handleDownload}
            className="bg-gradient-to-tr from-[#4378b9] to-[#57a0e6] text-white w-60 p-2.5 rounded-lg shadow-lg flex justify-center items-center cursor-pointer hover:opacity-90"
          >
            <span>Descargar PDF</span>
            <span className="ml-2 pi pi-download"></span>
          </div>
        </div>
      ) : (
        /* Spinner de carga mientras el i5-14600KF y LibreOffice hacen la magia */
        <div className="flex flex-col items-center mt-10">
          <span className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></span>
          <p className="text-gray-500 animate-pulse">
            Generando documento PDF... Esto puede tardar unos segundos dependiendo de la complejidad del documento y el rendimiento del servidor.
          </p>
        </div>
      )}
    </Details>
  );
};

export default DetailManifiesto;