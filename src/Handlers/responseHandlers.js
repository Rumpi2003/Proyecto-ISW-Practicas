// src/Handlers/responseHandlers.js

// 1. Para manejar respuestas de éxito
export const handleSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
};

// Para manejar respuestas de error del cliente
export const handleErrorClient = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        details: details,
    });
};
