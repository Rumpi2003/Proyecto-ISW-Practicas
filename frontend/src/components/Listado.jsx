import React, { useState, useEffect } from 'react';
import * as config from '../config.js'; 
const API_URL = config.API_URL;

const Listado = ({ listKey }) => {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. FUNCIÓN PARA ELIMINAR (DELETE)
    const handleDelete = async (id) => {
        // Pedir confirmación antes de eliminar
        if (!window.confirm(`¿Estás seguro de eliminar la oferta con ID ${id}?`)) {
            return;
        }

        try {
            // Llama al endpoint DELETE /api/v1/ofertas/:id
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                // Para que esto funcione, el backend debe tener la ruta DELETE /:id
                // sin el middleware de autenticación por ahora.
            });
            
            if (res.ok) {
                // Si la eliminación es exitosa (Status 200 OK o 204 No Content),
                // actualizamos el estado local de React sin recargar la página
                setOfertas(prevOfertas => prevOfertas.filter(o => o.id !== id));
            } else {
                // Si hay un error 404 o 500, leemos el mensaje estandarizado de tu API
                const errorData = await res.json();
                alert(`❌ Error al eliminar: ${errorData.message || 'Error desconocido.'}`);
            }
        } catch (err) {
            alert('❌ Error de conexión con el servidor.');
        }
    };

    useEffect(() => {
        // ... (El código de fetch es el mismo)
        fetch(API_URL) 
            .then(res => {
                // ...
                return res.json();
            })
            .then(data => {
                setOfertas(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError('Error al conectar con el backend o al obtener datos.');
                setLoading(false);
            });
    }, [listKey]); 

    if (loading) return <p>Cargando ofertas...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>Plataforma de Ofertas ({ofertas.length})</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {ofertas.map(oferta => (
                    <div key={oferta.id} style={{ border: '1px solid #ccc', padding: '15px', width: '300px' }}>
                        <h3>{oferta.titulo} (ID: {oferta.id})</h3> {/* Mostrar ID es útil para el testing */}
                        <p><strong>Empresa:</strong> {oferta.nombreEmpresa}</p>
                        <p><strong>Requisitos:</strong> {oferta.requisitosPrevios}</p>
                        <p><strong>Límite:</strong> {new Date(oferta.fechaLimitePostulacion).toLocaleDateString()}</p>

                        <div style={{ marginTop: '10px' }}>
                            <button 
                                onClick={() => alert(`Proximo a implementar`)}
                                style={{ marginRight: '10px', background: '#f5b041', color: 'black', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                            >
                                Modificar
                            </button>
                            <button 
                                onClick={() => handleDelete(oferta.id)} // Llama a la nueva función
                                style={{ background: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </div>
                        {/* El botón 'Ver' se cumple haciendo click en el botón modificar e ir a una ruta GET /:id */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Listado;