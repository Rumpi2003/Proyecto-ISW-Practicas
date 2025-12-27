import app from "./app.js"; 
import { AppDataSource } from "./config/db.config.js";
import { Encargado } from "./entities/encargado.entity.js"; 
import bcrypt from "bcrypt";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos conectada correctamente");

    const encargadoRepo = AppDataSource.getRepository(Encargado);
    
    // Configuración predeterminada del administrador
    const rutAdmin = "11.111.111-1";
    const emailAdmin = "admin@ubb.cl";
    const passAdmin = "admin123";

    // Verificar si el administrador ya existe por RUT
    const adminExiste = await encargadoRepo.findOneBy({ rut: rutAdmin });

    if (!adminExiste) {
      console.log("Creando administrador inicial...");
      const hashedPassword = await bcrypt.hash(passAdmin, 10);
      const nuevoEncargado = encargadoRepo.create({
        nombre: "Administrador Inicial",
        rut: rutAdmin,        
        email: emailAdmin,
        password: hashedPassword,
        facultad: "Administración",
      });
      await encargadoRepo.save(nuevoEncargado);
      console.log("Usuario administrador creado exitosamente.");

    } else {
      console.log("El usuario ya existe. Actualizando credenciales...");
      
      // Actualizar datos de acceso para asegurar consistencia
      adminExiste.email = emailAdmin;
      adminExiste.password = await bcrypt.hash(passAdmin, 10);
      
      await encargadoRepo.save(adminExiste);
      console.log("Credenciales de administrador actualizadas correctamente.");
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error durante la inicialización:", error);
  }
}

main();