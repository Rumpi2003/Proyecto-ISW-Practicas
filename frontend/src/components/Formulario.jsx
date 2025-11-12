import React, { useState } from 'react';
//import { API_URL } from '../config.js'; 
import * as config from '../config.js'; 
const API_URL = config.API_URL;

const initialForm = {
    titulo: '', descripcion: '', nombreEmpresa: '', contactoEmail: '', 
    contactoTelefono: '', carrerasDestino: '', requisitosPrevios: '', 
    fechaLimitePostulacion: ''
};

const Formulario = ({ onOfferCreated }) => {
    const [formData, setFormData] = useState(initialForm);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) { 
                setMessage(`Éxito: ${data.message}`);
                setFormData(initialForm); 
                onOfferCreated(); 
            } else {
                setMessage(`Error: ${data.details || data.message}`);
            }

        } catch (err) {
            setMessage('Error de red: No se pudo contactar al servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ 
            padding: '20px', border: '1px dashed #000',
            display: 'flex', flexDirection: 'column', gap: '10px' 
        }}>
            <h3>Publicar Nueva Oferta (POST)</h3>
            <p style={{ color: message.startsWith('X') ? 'red' : 'green' }}>{message || 'Ingresa todos los datos requeridos.'}</p>
            
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción completa" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }} /><br/>
            <input type="text" name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange} placeholder="Nombre de la Empresa" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            <input type="text" name="carrerasDestino" value={formData.carrerasDestino} onChange={handleChange} placeholder="Carreras (ej: Ingeniería Civil, Informática)" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            <textarea name="requisitosPrevios" value={formData.requisitosPrevios} onChange={handleChange} placeholder="Requisitos previos" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }} /><br/>
            <input type="email" name="contactoEmail" value={formData.contactoEmail} onChange={handleChange} placeholder="Email Contacto" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            <input type="text" name="contactoTelefono" value={formData.contactoTelefono} onChange={handleChange} placeholder="Teléfono Contacto (10 dígitos)" required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            <label style={{ textAlign: 'left', marginBottom: '5px' }}>Fecha Límite Postulación:</label> 
            <input type="date" name="fechaLimitePostulacion" value={formData.fechaLimitePostulacion} onChange={handleChange} required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /><br/>
            
            <button type="submit" disabled={isSubmitting}
                style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}
            >
                {isSubmitting ? 'Publicando...' : 'Publicar Oferta'}
            </button>
        </form>
    );
};

export default Formulario; 