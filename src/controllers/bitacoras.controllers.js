// src/controllers/solicitud.controller.js
import * as bitacorasService from "../services/bitacoras.service.js";

export class BitacorasController {

  async create(req, res) {
    try {
      const { titulo, descripcion, userId } = req.body;

      if (!titulo || !descripcion || !userId) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos requeridos: titulo, descripcion, userId"
        });
      }

      const bitacora = await bitacorasService.createBitacora({
        titulo,
        descripcion,
        userId
      });

      res.status(201).json({
        success: true,
        message: "Bitácora creada exitosamente",
        data: bitacora
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

      const bitacoras = await bitacorasService.getBitacoras(userId);

      res.status(200).json({
        success: true,
        message: "Bitácoras obtenidas exitosamente",
        data: bitacoras
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

      const bitacora = await bitacorasService.getBitacoraById(id);

      if (!bitacora) {
        return res.status(404).json({
          success: false,
          message: "Bitácora no encontrada"
        });
      }

      res.status(200).json({
        success: true,
        message: "Bitácora obtenida exitosamente",
        data: bitacora
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateBitacoras(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descripcion } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      const bitacora = await bitacorasService.getBitacoraById(id);

      if (!bitacora) {
        return res.status(404).json({
          success: false,
          message: "Bitácora no encontrada"
        });
      }

      const bitacoraActualizada = await bitacorasService.updateBitacora(id, {
        titulo: titulo || bitacora.titulo,
        descripcion: descripcion || bitacora.descripcion
      });

      res.status(200).json({
        success: true,
        message: "Bitácora actualizada exitosamente",
        data: bitacoraActualizada
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

      const bitacora = await bitacorasService.getBitacoraById(id);

      if (!bitacora) {
        return res.status(404).json({
          success: false,
          message: "Bitácora no encontrada"
        });
      }

      const resultado = await bitacorasService.deleteBitacora(id);

      if (resultado) {
        res.status(200).json({
          success: true,
          message: "Bitácora eliminada exitosamente"
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No se pudo eliminar la bitácora"
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