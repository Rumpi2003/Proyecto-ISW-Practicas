import axios from './root.service.js';

// Estudiante: subir bitácoras (PDFs)
export const subirBitacoras = async (archivos, descripcion) => {
  const formData = new FormData();
  formData.append('descripcion', descripcion);
  
  // Agregar cada archivo al formData
  archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  const response = await axios.post('/bitacoras', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Estudiante: obtener sus bitácoras
export const obtenerMisBitacoras = async () => {
  const response = await axios.get('/bitacoras/mis-bitacoras');
  return response.data;
};

// Estudiante: actualizar su bitácora (reemplazar archivos)
export const actualizarBitacoraPropia = async (id, archivos, descripcion) => {
  const formData = new FormData();
  if (descripcion) formData.append('descripcion', descripcion);
  archivos.forEach((archivo) => {
    formData.append('archivos', archivo);
  });

  const response = await axios.put(`/bitacoras/mis-bitacoras/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Estudiante: eliminar su bitácora
export const eliminarBitacoraPropia = async (id) => {
  const response = await axios.delete(`/bitacoras/mis-bitacoras/${id}`);
  return response.data;
};

// Encargado: obtener todas las bitácoras
export const obtenerTodasLasBitacoras = async () => {
  const response = await axios.get('/bitacoras');
  return response.data;
};

// Encargado: obtener bitácora específica
export const obtenerBitacoraPorId = async (id) => {
  const response = await axios.get(`/bitacoras/${id}`);
  return response.data;
};

// Encargado: actualizar estado de bitácora
export const actualizarEstadoBitacora = async (id, estado, comentarios) => {
  const response = await axios.patch(`/bitacoras/${id}/estado`, {
    estado,
    comentarios
  });
  return response.data;
};

// Encargado: eliminar bitácora
export const eliminarBitacora = async (id) => {
  const response = await axios.delete(`/bitacoras/${id}`);
  return response.data;
};
