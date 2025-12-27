import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db.config.js';
import { Estudiante } from '../entities/estudiante.entity.js';
import { Encargado } from '../entities/encargado.entity.js';
import { Supervisor } from '../entities/supervisor.entity.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario en las 3 tablas (en orden)
    let user = await AppDataSource.getRepository(Estudiante).findOneBy({ email });
    let rol = 'estudiante';

    if (!user) {
      user = await AppDataSource.getRepository(Encargado).findOneBy({ email });
      rol = 'encargado';
    }

    if (!user) {
      user = await AppDataSource.getRepository(Supervisor).findOneBy({ email });
      rol = 'supervisor';
    }

    // 2. Si no lo encontramos en ninguna tabla
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado. Verifique el correo.' });
    }

    // 3. Verificamos la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 4. Generamos el Token (JWT)
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: rol }, 
      process.env.JWT_SECRET || "claveSecreta123", 
      { expiresIn: '2h' }
    );

    // 5. Respondemos al Frontend
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt'); 
  res.json({ message: 'Sesión cerrada exitosamente' });
};