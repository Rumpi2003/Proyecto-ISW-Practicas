import app from "./app.js";
import { AppDataSource } from "./config/db.config.js";
import { Encargado } from "./entities/encargado.entity.js";
import { Supervisor } from "./entities/supervisor.entity.js";
import { Carrera } from "./entities/carrera.entity.js";
import { Facultad } from "./entities/facultad.entity.js";
import { Empresa } from "./entities/empresa.entity.js"; // 👈 1. Importamos Empresa
import bcrypt from "bcrypt";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Base de datos conectada correctamente");

    const facultadRepo = AppDataSource.getRepository(Facultad);
    const carreraRepo = AppDataSource.getRepository(Carrera);
    const encargadoRepo = AppDataSource.getRepository(Encargado);
    const supervisorRepo = AppDataSource.getRepository(Supervisor);
    const empresaRepo = AppDataSource.getRepository(Empresa); // 👈 2. Repositorio

    // 1. CREAR FACULTADES Y CARRERAS
    const countFacultades = await facultadRepo.count();
    
    if (countFacultades === 0) {
      console.log("Creando Facultades y Carreras UBB Concepción...");

      const dataUBB = [
        {
          nombre: "Arquitectura, Construcción y Diseño",
          carreras: ["Arquitectura", "Diseño Industrial", "Ingeniería en Construcción"]
        },
        {
          nombre: "Ciencias",
          carreras: ["Programa de Bachillerato en Ciencias (Concepción)", "Ingeniería Estadística"]
        },
        {
          nombre: "Ciencias Empresariales",
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
          carreras: ["Trabajo Social (Concepción)"]
        },
        {
          nombre: "Ingeniería",
          carreras: [
            "Ingeniería Civil", "Ingeniería Civil Eléctrica", "Ingeniería Civil en Automatización",
            "Ingeniería Civil Industrial", "Ingeniería Civil Mecánica", "Ingeniería Civil Química",
            "Ingeniería Eléctrica", "Ingeniería Electrónica", "Ingeniería Mecánica"
          ]
        }
      ];

      for (const f of dataUBB) {
        const facultadGuardada = await facultadRepo.save(facultadRepo.create({ nombre: f.nombre }));
        for (const nombreCar of f.carreras) {
          await carreraRepo.save(carreraRepo.create({ nombre: nombreCar, facultad: facultadGuardada }));
        }
      }
      console.log("✅ Facultades y Carreras listas.");
    }

    // 2. CREAR ENCARGADO INICIAL
    const totalEncargados = await encargadoRepo.count();
    
    if (totalEncargados === 0) {
      console.log("⚠️ Creando encargado inicial...");
      
      const facultadInicial = await facultadRepo.findOneBy({ nombre: "Arquitectura, Construcción y Diseño" });
      
      if (!facultadInicial) {
         console.error("❌ ERROR: No se encontró la facultad especificada para el encargado.");
      } else {
          const hashedPassword = await bcrypt.hash("admin123", 10);
    
          const nuevoEncargado = encargadoRepo.create({
            nombre: "Administrador Inicial",
            rut: "11.111.111-1",
            email: "admin@ubb.cl",
            password: hashedPassword,
            facultad: facultadInicial, 
          });
    
          await encargadoRepo.save(nuevoEncargado);
          console.log(`🚀 Encargado inicial creado para la facultad: ${facultadInicial.nombre}`);
      }
    }

    // 3. CREAR EMPRESAS (NUEVO BLOQUE) 🏭
    const totalEmpresas = await empresaRepo.count();
    if (totalEmpresas === 0) {
      console.log("⚠️ Creando empresas de prueba...");

      const empresasData = [
        {
          nombre: "Tech Solutions Biobío",
          razonSocial: "Tech Solutions SpA",
          direccion: "Av. Collao 1202, Concepción",
          web: "www.techsolutions.cl"
        },
        {
          nombre: "Constructora del Sur",
          razonSocial: "Constructora Del Sur S.A.",
          direccion: "Calle O Higgins 440, Concepción",
          web: "www.constructorasur.cl"
        },
        {
          nombre: "Banco Estado",
          razonSocial: "Banco del Estado de Chile",
          direccion: "Barros Arana 500, Concepción",
          web: "www.bancoestado.cl"
        }
      ];

      // Usamos .save con un array para guardarlas todas de una vez
      await empresaRepo.save(empresasData);
      console.log("✅ Empresas de prueba creadas.");
    }

    // 4. CREAR SUPERVISOR INICIAL
    const totalSupervisores = await supervisorRepo.count();
    if (totalSupervisores === 0) {
      const hashedSupPassword = await bcrypt.hash("supervisor123", 10);
      await supervisorRepo.save(supervisorRepo.create({
        nombre: "Supervisor de Prueba",
        rut: "22.222.222-2",
        email: "supervisor@empresa.com",
        password: hashedSupPassword,
        empresa: "Tech Solutions Biobío", // Asumiendo que es un string por ahora
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