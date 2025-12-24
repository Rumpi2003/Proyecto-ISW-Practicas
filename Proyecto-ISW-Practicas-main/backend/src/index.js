// src/index.js
import app from "./app.js"; //configuracion de Express
import { AppDataSource } from "./config/db.config.js";
import { Encargado } from "./entities/encargado.entity.js"; //entidad correcta
import bcrypt from "bcrypt";

async function main() {
  try {
    //iniciar conexion a BD
    await AppDataSource.initialize();
    console.log("Base de datos conectada correctamente");

    //crear Encargado inicial
    const encargadoRepo = AppDataSource.getRepository(Encargado);
    
    //si existe al menos un encargado
    const totalEncargados = await encargadoRepo.count();

    if (totalEncargados === 0) {
      console.log("No hay encargados en la base de datos. Creando uno inicial...");

      const hashedPassword = await bcrypt.hash("admin123", 10); //contraseña inicial

      const nuevoEncargado = encargadoRepo.create({
        nombre: "Administrador Inicial",
        rut: "11.111.111-1",
        email: "admin@ubb.cl", //usuario maestro
        password: hashedPassword,
        facultad: "Administración",
      });

      await encargadoRepo.save(nuevoEncargado);
      console.log("Encargado inicial creado: admin@ubb.cl / admin123");
    }

    // iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` servidor escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
  }
}

main();