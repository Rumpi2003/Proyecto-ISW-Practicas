import axios from './axios.config';

export const createSolicitud = async (mensaje, archivo) => {
  const formData = new FormData();

  formData.append('mensaje', mensaje);

  if (archivo) {
    formData.append('archivo', archivo); 
  }

  const response = await axios.post('/solicitudes', formData);
  return response.data;
};