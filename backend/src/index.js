import app from "./app.js";
import { AppDataSource } from "./config/db.config.js";
import { Encargado } from "./entities/encargado.entity.js";
import { Supervisor } from "./entities/supervisor.entity.js";
import { Carrera } from "./entities/carrera.entity.js";
import { Facultad } from "./entities/facultad.entity.js";
import { Empresa } from "./entities/empresa.entity.js";
import { Estudiante } from "./entities/estudiante.entity.js"; 
import bcrypt from "bcrypt";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Base de datos conectada correctamente");

    const facultadRepo = AppDataSource.getRepository(Facultad);
    const carreraRepo = AppDataSource.getRepository(Carrera);
    const encargadoRepo = AppDataSource.getRepository(Encargado);
    const empresaRepo = AppDataSource.getRepository(Empresa);
    const estudianteRepo = AppDataSource.getRepository(Estudiante);
    // const supervisorRepo = AppDataSource.getRepository(Supervisor); // Omitido por ahora

    // ==========================================
    // 1. CREAR FACULTADES Y CARRERAS 🎓
    // ==========================================
    const countFacultades = await facultadRepo.count();
    
    if (countFacultades === 0) {
      console.log("⚙️  Sembrando Facultades y Carreras UBB...");

      const dataUBB = [
        {
          nombre: "Arquitectura, Construcción y Diseño",
          carreras: [
            { nombre: "Arquitectura", abrev: "ARQ" },
            { nombre: "Diseño Industrial", abrev: "DI" },
            { nombre: "Ingeniería en Construcción", abrev: "IC" }
          ]
        },
        {
          nombre: "Ciencias",
          carreras: [
            { nombre: "Programa de Bachillerato en Ciencias (Concepción)", abrev: "BACH" },
            { nombre: "Ingeniería Estadística", abrev: "IE" }
          ]
        },
        {
          nombre: "Ciencias Empresariales",
          carreras: [
            { nombre: "Contador Público y Auditor (Concepción)", abrev: "CPA" },
            { nombre: "Derecho", abrev: "DER" },
            { nombre: "Ingeniería Civil en Informática (Concepción)", abrev: "ICI" },
            { nombre: "Ingeniería Comercial (Concepción)", abrev: "ICO" },
            { nombre: "Ingeniería de Ejecución en Computación e Informática", abrev: "IECI" }
          ]
        },
        {
          nombre: "Educación y Humanidades",
          carreras: [
            { nombre: "Trabajo Social (Concepción)", abrev: "TS" }
          ]
        },
        {
          nombre: "Ingeniería",
          carreras: [
            { nombre: "Ingeniería Civil", abrev: "ICIVIL" },
            { nombre: "Ingeniería Civil Eléctrica", abrev: "ICE" },
            { nombre: "Ingeniería Civil en Automatización", abrev: "ICA" },
            { nombre: "Ingeniería Civil Industrial", abrev: "ICI-IND" },
            { nombre: "Ingeniería Civil Mecánica", abrev: "ICM" },
            { nombre: "Ingeniería Civil Química", abrev: "ICQ" },
            { nombre: "Ingeniería Eléctrica", abrev: "IE" },
            { nombre: "Ingeniería Electrónica", abrev: "IEL" },
            { nombre: "Ingeniería Mecánica", abrev: "IM" }
          ]
        }
      ];

      for (const f of dataUBB) {
        const facultadGuardada = await facultadRepo.save(facultadRepo.create({ nombre: f.nombre }));
        
        for (const car of f.carreras) {
          await carreraRepo.save(carreraRepo.create({ 
            nombre: car.nombre, 
            abreviacion: car.abrev, 
            facultad: facultadGuardada 
          }));
        }
      }
      console.log("✅ Facultades y Carreras listas.");
    }

    // ==========================================
    // 2. CREAR ENCARGADO INICIAL 👤
    // ==========================================
    const totalEncargados = await encargadoRepo.count();
    
    if (totalEncargados === 0) {
      console.log("⚙️  Creando encargado inicial...");
      
      const facultadInicial = await facultadRepo.findOneBy({ nombre: "Arquitectura, Construcción y Diseño" });
      
      if (facultadInicial) {
         const hashedPassword = await bcrypt.hash("admin123", 10);
    
         await encargadoRepo.save(encargadoRepo.create({
           nombre: "Administrador Inicial",
           rut: "11.111.111-1",
           email: "admin@ubb.cl",
           password: hashedPassword,
           facultad: facultadInicial, 
         }));
         console.log(`✅ Encargado inicial creado.`);
      }
    }

    // ==========================================
    // 3. CREAR EMPRESAS 🏢
    // ==========================================
    const totalEmpresas = await empresaRepo.count();
    if (totalEmpresas === 0) {
      console.log("⚙️  Creando empresas de prueba...");

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

      await empresaRepo.save(empresasData);
      console.log("✅ Empresas de prueba creadas.");
    }

    // ==========================================
    // 4. CREAR ESTUDIANTE INICIAL 🎓
    // ==========================================
    const totalEstudiantes = await estudianteRepo.count();
    if (totalEstudiantes === 0) {
        console.log("⚙️  Creando estudiante inicial...");

        // Buscamos la carrera ICI para asignarla al alumno
        const carreraICI = await carreraRepo.findOneBy({ abreviacion: "ICI" });

        if (carreraICI) {
            const hashedEstPassword = await bcrypt.hash("estudiante123", 10);
            
            await estudianteRepo.save(estudianteRepo.create({
                nombre: "Estudiante UBB",
                rut: "12.345.678-9",
                email: "estudiante@alumnos.ubb.cl",
                password: hashedEstPassword,
                carrera: carreraICI, // Pasamos el objeto carrera (ManyToOne)
                nivelPractica: "IV"
            }));
            console.log("✅ Estudiante inicial creado: estudiante@alumnos.ubb.cl / estudiante123");
        } else {
            console.warn("⚠️ No se encontró la carrera ICI. El estudiante no pudo ser creado.");
        }
    }

    // ==========================================
    // 5. SERVER START
    // ==========================================
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar la aplicación:", error);
  }
}

main();