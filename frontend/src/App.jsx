// frontend/src/App.jsx (MODIFICACIÓN DEFINITIVA DE CENTRADO)

import React, { useState } from 'react';
import Listado from './components/Listado';
import Formulario from './components/Formulario';

function App() {
    const [listKey, setListKey] = useState(0); 
    const refreshList = () => setListKey(prev => prev + 1);

    return (
        // 1. ELIMINAR EL PADDING DEL APP, Y ASEGURAR QUE EL BLOQUE OCUPA EL 100%
        <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* 2. CENTRAR SOLO EL TÍTULO */}
            <h1 style={{ textAlign: 'center', padding: '20px 0' }}>Gestión de Ofertas de Práctica</h1>
            
            {/* 3. CONTENEDOR DEL FORMULARIO: ANCHO FIJO Y CENTRADO CON MARGIN: AUTO */}
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                 <Formulario onOfferCreated={refreshList} /> 
            </div>

            <hr style={{ width: '80%', margin: '40px auto' }} /> 

            {/* 4. CONTENEDOR DEL LISTADO: ANCHO FIJO Y CENTRADO CON MARGIN: AUTO */}
            <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                <Listado key={listKey} listKey={listKey} /> 
            </div>
            
        </div>
    );
}

export default App;