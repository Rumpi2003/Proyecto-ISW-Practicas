// src/controllers/solicitud.controller.js
import * as informesService from "../services/informes.service.js";

export class InformesController {

  async create(req, res) {
    try {
      const { titulo, descripcion, userId } = req.body;

      if (!titulo || !descripcion || !userId) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos: titulo, descripcion, userId"
        });
      }

      const informe = await informesService.createInforme({
        titulo,
        descripcion,
        userId
      });

      res.status(201).json({
        success: true,
        message: "Informe creado exitosamente",
        data: informe
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId es requerido"
        });
      }

      const informes = await informesService.getInformes(userId);

      res.status(200).json({
        success: true,
        message: "Informes obtenidos exitosamente",
        data: informes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      const informe = await informesService.getInformeById(id);

      if (!informe) {
        return res.status(404).json({
          success: false,
          message: "Informe no encontrado"
        });
      }

      res.status(200).json({
        success: true,
        message: "Informe obtenido exitosamente",
        data: informe
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateInformes(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descripcion } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      const informe = await informesService.getInformeById(id);

      if (!informe) {
        return res.status(404).json({
          success: false,
          message: "Informe no encontrado"
        });
      }

      const informeActualizado = await informesService.updateInforme(id, {
        titulo: titulo || informe.titulo,
        descripcion: descripcion || informe.descripcion
      });

      res.status(200).json({
        success: true,
        message: "Informe actualizado exitosamente",
        data: informeActualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      const informe = await informesService.getInformeById(id);

      if (!informe) {
        return res.status(404).json({
          success: false,
          message: "Informe no encontrado"
        });
      }

      const resultado = await informesService.deleteInforme(id);

      if (resultado) {
        res.status(200).json({
          success: true,
          message: "Informe eliminado exitosamente"
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No se pudo eliminar el informe"
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}