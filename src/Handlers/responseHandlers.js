export function handleSuccess(res, status, message, data) {
    res.status(status).json({ message, data, status: "Success" });
}

export function handleErrorClient(res, status, message) {
    res.status(status).json({ message, status: "Client Error" });
}

export function handleErrorServer(res, status, message) {
    res.status(status).json({ message, status: "Server Error" });
}
