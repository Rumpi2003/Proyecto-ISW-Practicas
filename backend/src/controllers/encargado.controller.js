const practicasMock = [
    {
        id_practica: 1,
        estudiante: "Cristina Morán",
        carrera: "Ingeniería Civil Informática",
        empresa: "Empresa A",
        estado: "PENDIENTE_ENCARGADO",
        nota_supervisor: 6.0,
    },
    {
        id_practica: 2,
        estudiante: "Angelo Valenzuela",
        carrera: "Ingeniería Civil",
        empresa: "Empresa B",
        estado: "PENDIENTE_ENCARGADO",
        nota_supervisor: 5.5,
    },
];

// GET /encargado/practicas/pendientes
export const getPracticasPendientes = (req, res) => {
    const pendientes = practicasMock.filter(
        (p) => p.estado === "PENDIENTE_ENCARGADO"
    );

    return res.json({
        success: true,
        message: `Se encontraron ${pendientes.length} prácticas pendientes`,
        data: pendientes,
    });
};

// GET /encargado/practicas/:idPractica
export const getDetallePractica = (req, res) => {
    const { idPractica } = req.params;
    const id = Number(idPractica);

    const practica = practicasMock.find((p) => p.id_practica === id);

    if (!practica) {
        return res.status(404).json({
            success: false,
            message: "Práctica no encontrada",
        });
    }

    // Simulamos bitácoras e informe final
    const bitacoras = [
        {
            id_bitacora: 1,
            fecha: "2025-09-01",
            resumen: "Primera semana de práctica",
        },
        {
            id_bitacora: 2,
            fecha: "2025-09-08",
            resumen: "Segunda semana de práctica",
        },
    ];

    const informeFinal = {
        id_informe: 1,
        titulo: "Informe Final de Práctica",
        url_pdf: "https://ejemplo.com/informe-final.pdf",
    };

    // Simulamos evaluación supervisor
    const evaluacion = {
        nota_supervisor: practica.nota_supervisor,
        nota_encargado: null,
        nota_final: null,
    };

    return res.json({
        success: true,
        message: "Detalle de práctica obtenido",
        data: {
            practica,
            bitacoras,
            informeFinal,
            evaluacion,
        },
    });
};

// POST /encargado/practicas/:idPractica/evaluacion
export const evaluarPractica = (req, res) => {
    const { idPractica } = req.params;
    const { nota_encargado } = req.body;
    const id = Number(idPractica);

    const practica = practicasMock.find((p) => p.id_practica === id);

    if (!practica) {
        return res.status(404).json({
            success: false,
            message: "Práctica no encontrada",
        });
    }

    // Validación
    const notaNum = Number(nota_encargado);
    if (Number.isNaN(notaNum) || notaNum < 1 || notaNum > 7) {
        return res.status(400).json({
            success: false,
            message: "La nota del encargado debe estar entre 1.0 y 7.0",
        });
    }

    const notaSupervisor = practica.nota_supervisor ?? 6.0;
    const notaFinal = (notaSupervisor + notaNum) / 2;

    // Simulamos guardar
    return res.json({
        success: true,
        message: "Evaluación del Encargado registrada (mock)",
        data: {
            id_practica: practica.id_practica,
            estudiante: practica.estudiante,
            nota_supervisor: notaSupervisor,
            nota_encargado: notaNum,
            nota_final: Number(notaFinal.toFixed(2)),
        },
    });
};
