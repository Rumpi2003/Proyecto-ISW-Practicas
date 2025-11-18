export const handleSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
};

export const handleErrorClient = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        details: details,
    });
};
