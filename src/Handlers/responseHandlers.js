// Respuestas de error estándar
export const handleErrorClient = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        details: details,
    });
};