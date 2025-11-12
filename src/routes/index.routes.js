import { Router } from "express";
import evaluacionRoutes from "./evaluacion.routes.js";

export function routerApi(app) {
    const router = Router();

    app.use("/api", router);

    // /api/evaluacion/...
    router.use("/evaluacion", evaluacionRoutes);
}
