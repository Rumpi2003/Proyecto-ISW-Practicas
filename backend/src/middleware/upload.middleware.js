import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/\s+/g, '_'); // para que no se repita
        cb(null, `${timestamp}_${safeName}`); // Nombre unico
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['application/pdf']; //solo pdf
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido (Solo PDF)'), false);
    }
};

export const uploadMiddleware = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo
}).single('archivo');

export const uploadPdfMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo
}).single('archivo');

// Middleware para múltiples archivos PDF (para bitácoras)
export const uploadBitacorasMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo por archivo
}).array('archivos', 10); // máximo 10 archivos