// src/services/user.service.js
import { AppDataSource } from "../config/db.config.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
    rol: data.rol || "estudiante",
  });

  return await userRepository.save(newUser);
}
//Buscar usuario
export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function updateUserProfile(userId, { email, password }) {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("Usuario no encontrado");

  if (email) {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("El email ya está en uso");
    }
    user.email = email;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  return await userRepository.save(user);
}
//funcion eliminar
export async function deleteUserAccount(userId) {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("Usuario no encontrado");
  await userRepository.remove(user);
}