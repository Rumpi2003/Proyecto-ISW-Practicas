import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

// Importante: Debes instalar 'bcrypt' si no lo has hecho: npm install bcrypt
const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = userRepository.create({
        email: data.email,
        password: hashedPassword,
    });

    return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
    return await userRepository.findOneBy({ email });
}