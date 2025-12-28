import axios from './axios.config';

export const createSolicitud = async (formData) => {
  const response = await axios.post('/solicitudes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMisSolicitudes = async () => {
  const response = await axios.get('/solicitudes/mis-solicitudes');
  return response.data;
};

export const updateSolicitud = async (id, formData) => {
  const response = await axios.put(`/solicitudes/mis-solicitudes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};