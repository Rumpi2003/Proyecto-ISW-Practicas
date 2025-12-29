import axios from './root.service.js';

// Estudiante: subir informe (un único PDF)
export const subirInforme = async (archivo, descripcion) => {
  const formData = new FormData();
  formData.append('descripcion', descripcion);
  formData.append('archivo', archivo);

  const response = await axios.post('/informes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Estudiante: obtener sus informes
export const obtenerMisInformes = async () => {
  const response = await axios.get('/informes/mis-informes');
  return response.data;
};

// Estudiante: actualizar su informe (reemplazar archivo)
export const actualizarInformePropio = async (id, archivo, descripcion) => {
  const formData = new FormData();
  if (descripcion) formData.append('descripcion', descripcion);
  formData.append('archivo', archivo);

  const response = await axios.put(`/informes/mis-informes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Estudiante: eliminar su informe
export const eliminarInformePropio = async (id) => {
  const response = await axios.delete(`/informes/mis-informes/${id}`);
  return response.data;
};

// Encargado: obtener todos los informes
export const obtenerTodosLosInformes = async () => {
  const response = await axios.get('/informes');
  return response.data;
};

// Encargado: obtener informe específico
export const obtenerInformePorId = async (id) => {
  const response = await axios.get(`/informes/${id}`);
  return response.data;
};

// Encargado: actualizar estado de informe
export const actualizarEstadoInforme = async (id, estado, comentarios) => {
  const response = await axios.patch(`/informes/${id}/estado`, {
    estado,
    comentarios
  });
  return response.data;
};

// Encargado: eliminar informe
export const eliminarInforme = async (id) => {
  const response = await axios.delete(`/informes/${id}`);
  return response.data;
};
