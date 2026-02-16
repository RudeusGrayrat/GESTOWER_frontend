import convertDocx from "../../../../utils/convertDocx";

const renderManifiesto = async (manifiesto, plantillaUrl, nombreArchivo) => {
    console.log("🔄 renderManifiesto iniciado");
    console.log("Manifiesto ID:", manifiesto._id);
    console.log("Número:", manifiesto.numeroManifiesto);

    try {
        // ============================================
        // Helper para manejar valores undefined/null
        // ============================================
        const safe = (value) => {
            if (value === undefined || value === null) return "";
            if (typeof value === 'string') return value;
            if (typeof value === 'number') return value.toString();
            if (typeof value === 'boolean') return value ? 'X' : '';
            return String(value);
        };

        // Helper para checkboxes (retorna 'X' o '')
        const check = (condition) => condition ? 'X' : '';

        // ============================================
        // Extraer datos con paths seguros
        // ============================================
        const generador = manifiesto.generadorId || {};
        const planta = manifiesto.plantaId || {};
        const plantaUbigeo = planta.ubigeoId || {};
        const residuo = manifiesto.residuo || {};
        const peligrosidad = manifiesto.peligrosidad || {};
        const transportista = manifiesto.transportistaId || {};
        const transportistaUbigeo = transportista.ubigeoId || {};
        const transporte = manifiesto.transporte || {};
        const destino = manifiesto.destinoId || {};
        const destinoUbigeo = destino.ubigeoId || {};
        const destinoFinal = manifiesto.destinoFinal || {};
        const contingencias = manifiesto.contingencias || {};
        const otrosManejos = manifiesto.otrosManejos || [];
        const referendoEntrega = manifiesto.referendoEntrega || {};
        const referendoRecepcion = manifiesto.referendoRecepcion || {};
        const devolucion = manifiesto.devolucionManifiesto || {};

        // ============================================
        // Construir objeto de datos para la plantilla
        // ============================================
        const data = {
            // ===== ENCABEZADO =====
            numero_manifiesto: safe(manifiesto.numeroManifiesto),
            año: safe(manifiesto.año),
            mes: safe(manifiesto.mes),

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
            ubigeo_planta: `${safe(plantaUbigeo.departamento)}/${safe(plantaUbigeo.provincia)}/${safe(plantaUbigeo.distrito)}`,
            distrito: safe(plantaUbigeo.distrito),
            provincia: safe(plantaUbigeo.provincia),
            departamento: safe(plantaUbigeo.departamento),
            coordenada_norte: safe(planta.coordenadasUtm?.norte),
            coordenada_este: safe(planta.coordenadasUtm?.este),
            coordenada_zona: safe(planta.coordenadasUtm?.zona),
            actividad_economica: safe(planta.actividadEconomica),
            sector: safe(planta.sector),
            responsable_gestion: safe(planta.responsableGestion?.nombre),
            cargo_responsable: safe(planta.responsableGestion?.cargo),
            dni_responsable: safe(planta.responsableGestion?.dni),
            correo_responsable: safe(planta.responsableGestion?.correo),
            telefono_responsable: safe(planta.responsableGestion?.telefono),

            // ===== IGA =====
            tiene_iga_si: check(planta.tieneIga === true),
            tiene_iga_no: check(planta.tieneIga === false),
            institucion_aprueba: safe(planta.institucionApruebaIga),
            fecha_aprobacion: safe(planta.fechaAprobacionIga),
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
            basilea_a3: check(residuo.codigoBasilea === 'A3'), // ¡CORREGIDO!
            basilea_a4: check(residuo.codigoBasilea === 'A4'),
            subcodigo_basilea: safe(residuo.subcodigoBasilea),
            informacion_adicional: safe(residuo.informacionAdicional),

            // ===== PELIGROSIDAD (Checkboxes) =====
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
            check_otros_peligros: check(peligrosidad.otros),

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
            nombre_conductor: safe(transporte.conductor?.nombre),
            tipo_vehiculo: safe(transporte.vehiculo?.tipo),
            placa_vehiculo: safe(transporte.vehiculo?.placa),
            fecha_recepcion: safe(transporte.fechaRecepcion),
            cantidad_recibida: safe(transporte.cantidadRecibida),
            observaciones_transporte: safe(transporte.observaciones),

            // ===== REFERENDO ENTREGA =====
            nombre_generador_firma: safe(referendoEntrega.nombreGenerador),
            firma_generador: safe(referendoEntrega.firmaGenerador),
            nombre_transportista_firma: safe(referendoEntrega.nombreTransportista),
            firma_transportista: safe(referendoEntrega.firmaTransportista),
            dni_transportista_firma: safe(referendoEntrega.dniTransportista),
            cargo_transportista_firma: safe(referendoEntrega.cargoTransportista),
            fecha_hora_entrega: safe(referendoEntrega.fechaHoraEntrega),

            // ===== DESTINO =====
            tratamiento: check(destinoFinal.tipoManejo === 'TRATAMIENTO'),
            valorizacion: check(destinoFinal.tipoManejo === 'VALORIZACION'),
            disposicion_final: check(destinoFinal.tipoManejo === 'DISPOSICION_FINAL'),
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
            nombre_destino_firma: safe(referendoRecepcion.nombreDestino),
            firma_destino: safe(referendoRecepcion.firmaDestino),
            dni_destino_firma: safe(referendoRecepcion.dniDestino),
            cargo_destino_firma: safe(referendoRecepcion.cargoDestino),
            fecha_hora_recepcion: safe(referendoRecepcion.fechaHoraRecepcion),

            // ===== 3.3 OTROS =====
            // Asumiendo que otrosManejos es un array, tomamos el primer elemento
            check_comercializacion: check(otrosManejos[0]?.tipo === 'COMERCIALIZACION'),
            check_exportacion: check(otrosManejos[0]?.tipo === 'EXPORTACION'),
            check_otro: check(otrosManejos[0]?.tipo === 'OTROS'),
            razon_social_receptor: safe(otrosManejos[0]?.razonSocialReceptor),
            ruc_receptor: safe(otrosManejos[0]?.rucReceptor),
            correo_receptor: safe(otrosManejos[0]?.correoElectronico),
            telefono_receptor: safe(otrosManejos[0]?.telefono),
            tipo_manejo_otro: safe(otrosManejos[0]?.tipoManejoRealizado),
            direccion_destino_otro: safe(otrosManejos[0]?.direccionDestino),
            documento_aprueba: safe(otrosManejos[0]?.documentoAprueba),

            // ===== CONTINGENCIAS =====
            derrame: safe(contingencias.derrame),
            infiltracion: safe(contingencias.infiltracion),
            incendio: safe(contingencias.incendio),
            explosion: safe(contingencias.explosion),
            otros_accidentes: safe(contingencias.otrosAccidentes),

            // ===== DEVOLUCIÓN =====
            nombre_representante_eors: safe(devolucion.representanteEors?.nombre),
            firma_representante_eors: safe(devolucion.representanteEors?.firma),
            dni_representante_eors: safe(devolucion.representanteEors?.dni),
            cargo_representante_eors: safe(devolucion.representanteEors?.cargo),
            nombre_responsable_generador: safe(devolucion.responsableGenerador?.nombre),
            firma_responsable_generador: safe(devolucion.responsableGenerador?.firma),
            dni_responsable_generador: safe(devolucion.responsableGenerador?.dni),
            cargo_responsable_generador: safe(devolucion.responsableGenerador?.cargo),
            fecha_devolucion: safe(devolucion.responsableGenerador?.fechaRecepcion),
            hora_devolucion: safe(devolucion.responsableGenerador?.horaRecepcion),

            // Valor por defecto para campos faltantes
            missingKey: "N/A"
        };

        // ============================================
        // Verificar variables undefined
        // ============================================
        const undefinedKeys = Object.keys(data).filter(key => data[key] === undefined);
        if (undefinedKeys.length > 0) {
            console.warn(`⚠️ Variables undefined encontradas:`, undefinedKeys);
            undefinedKeys.forEach(key => data[key] = '');
        }

        console.log("📊 Datos preparados. Total de variables:", Object.keys(data).length);
        console.log("🔍 Primeras 10 variables:", Object.keys(data).slice(0, 10));

        // ============================================
        // Renderizar documento
        // ============================================
        console.log("🔄 Llamando a convertDocx...");
        const archivoRenderizado = await convertDocx(
            data,
            plantillaUrl,
            nombreArchivo || `Manifiesto_${manifiesto.numeroManifiesto || 'documento'}`
        );

        if (!archivoRenderizado) {
            throw new Error("No se pudo renderizar el manifiesto");
        }

        console.log("✅ renderManifiesto completado exitosamente");
        return archivoRenderizado;

    } catch (error) {
        console.error("❌ Error en renderManifiesto:", error.message);
        console.error("Stack:", error.stack);
        throw error;
    }
};

export default renderManifiesto;