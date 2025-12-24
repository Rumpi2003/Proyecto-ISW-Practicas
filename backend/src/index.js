// src/index.js
import app from "./app.js";
import { AppDataSource } from "./config/db.config.js";
import { Encargado } from "./entities/encargado.entity.js";
import { Supervisor } from "./entities/supervisor.entity.js";
import { Carrera } from "./entities/carrera.entity.js";
import { Facultad } from "./entities/facultad.entity.js";
import bcrypt from "bcrypt";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Base de datos conectada correctamente");

    const facultadRepo = AppDataSource.getRepository(Facultad);
    const carreraRepo = AppDataSource.getRepository(Carrera);
    const encargadoRepo = AppDataSource.getRepository(Encargado);
    const supervisorRepo = AppDataSource.getRepository(Supervisor);

    // crear facultades y carrreras por defecto si no existen
    const countFacultades = await facultadRepo.count();
    if (countFacultades === 0) {
      console.log("Creando Facultades y Carreras UBB Concepción...");

      const dataUBB = [
        {
          nombre: "Arquitectura, Construcción y Diseño",
          color: "#99C286",
          carreras: ["Arquitectura", "Diseño Industrial", "Ingeniería en Construcción"]
        },
        {
          nombre: "Ciencias",
          color: "#70C2C4",
          carreras: ["Programa de Bachillerato en Ciencias (Concepción)", "Ingeniería Estadística"]
        },
        {
          nombre: "Ciencias Empresariales",
          color: "#F4A460",
          carreras: [
            "Contador Público y Auditor (Concepción)",
            "Derecho",
            "Ingeniería Civil en Informática (Concepción)",
            "Ingeniería Comercial (Concepción)",
            "Ingeniería de Ejecución en Computación e Informática"
          ]
        },
        {
          nombre: "Educación y Humanidades",
          color: "#E57373",
          carreras: ["Trabajo Social (Concepción)"]
        },
        {
          nombre: "Ingeniería",
          color: "#FFD54F",
          carreras: [
            "Ingeniería Civil", "Ingeniería Civil Eléctrica", "Ingeniería Civil en Automatización",
            "Ingeniería Civil Industrial", "Ingeniería Civil Mecánica", "Ingeniería Civil Química",
            "Ingeniería Eléctrica", "Ingeniería Electrónica", "Ingeniería Mecánica"
          ]
        }
      ];

      for (const f of dataUBB) {
        const facultadGuardada = await facultadRepo.save(facultadRepo.create({ nombre: f.nombre, color: f.color }));
        for (const nombreCar of f.carreras) {
          await carreraRepo.save(carreraRepo.create({ nombre: nombreCar, facultad: facultadGuardada }));
        }
      }
      console.log("✅ Facultades y Carreras listas.");
    }

    // 2. CREAR ENCARGADO INICIAL (Vinculado a una facultad real)
    const totalEncargados = await encargadoRepo.count();
    if (totalEncargados === 0) {
      console.log("⚠️ Creando encargado inicial...");
      
      // Buscamos la facultad de la base de datos para obtener su ID real
      const facEmpresariales = await facultadRepo.findOneBy({ nombre: "Ciencias Empresariales" });
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const nuevoEncargado = encargadoRepo.create({
        nombre: "Administrador Inicial",
        rut: "11.111.111-1",
        email: "admin@ubb.cl",
        password: hashedPassword,
        facultad: facEmpresariales, // <--- Ahora pasamos el OBJETO facultad, no un texto
      });

      await encargadoRepo.save(nuevoEncargado);
      console.log("🚀 Encargado inicial creado: admin@ubb.cl / admin123");
    }

    // 3. CREAR SUPERVISOR INICIAL
    const totalSupervisores = await supervisorRepo.count();
    if (totalSupervisores === 0) {
      const hashedSupPassword = await bcrypt.hash("supervisor123", 10);
      await supervisorRepo.save(supervisorRepo.create({
        nombre: "Supervisor de Prueba",
        rut: "22.222.222-2",
        email: "supervisor@empresa.com",
        password: hashedSupPassword,
        empresa: "Empresa x",
      }));
      console.log("🚀 Supervisor inicial creado");
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar la aplicación:", error);
  }
}

main();