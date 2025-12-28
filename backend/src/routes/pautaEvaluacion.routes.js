    import { Router } from "express";
    import { PautaEvaluacionController } from "../controllers/pautaEvaluacion.controller.js";
    import { authMiddleware } from "../middleware/auth.middleware.js";
    import { checkEncargado } from "../middleware/checkEncargado.middleware.js";

    const router = Router();
    const controller = new PautaEvaluacionController();

    router.post("/", authMiddleware, checkEncargado, controller.create);

    router.get("/", authMiddleware, checkEncargado, controller.getAll);

    router.get("/:idPauta", authMiddleware, checkEncargado,  controller.getById);

    router.put("/:idPauta", authMiddleware, checkEncargado, controller.update);

    router.delete("/:idPauta", authMiddleware, checkEncargado, controller.delete);

    export default router;