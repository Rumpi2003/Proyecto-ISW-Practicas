import { useState, useEffect } from 'react';
import axios from '../services/root.service';
import { useNavigate } from 'react-router-dom';

const Historial = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📜 Historial de Evaluaciones</h1>
                    <p className="text-gray-500 mt-1">Registro de notas finales de alumnos.</p>
                </div>
                <button onClick={() => navigate('/home')} className="bg-white border px-5 py-2 rounded-xl font-bold text-gray-600">
                    ⬅ Volver
                </button>
            </header>
        </div>
    );
};
export default Historial;