// src/services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/ConfigDb.js";
import { User } from "../entity/usuario.entity.js";
import { JWT_SECRET } from "../config/ConfigEnv.js";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (email, password, nombre) => {
  try {
    // Verificar si el usuario ya existe
    const userExistente = await userRepository.findOne({ where: { email } });

    if (userExistente) {
      throw new Error("El email ya está registrado");
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = userRepository.create({
      email,
      password: passwordHash,
      nombre: nombre || email,
    });

    await userRepository.save(nuevoUsuario);

    // Retornar usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword;
  } catch (error) {
    throw new Error(`Error al registrar usuario: ${error.message}`);
  }
};

export const loginUser = async (email, password) => {
  try {
    // Buscar el usuario por email
    const usuario = await userRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new Error("Email o contraseña incorrectos");
    }

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw new Error("Email o contraseña incorrectos");
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retornar usuario sin contraseña y con token
    const { password: _, ...usuarioSinPassword } = usuario;
    return {
      token,
      usuario: usuarioSinPassword
    };
  } catch (error) {
    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Token inválido: ${error.message}`);
  }
};