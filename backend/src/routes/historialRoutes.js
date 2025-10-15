const express = require("express");
const router = express.Router();
const historialController = require("../controllers/historialController");

router.get("/dni/:dni", historialController.getHistorialPorDni);
router.get("/:id", historialController.getHistorialPorId);
router.post("/", historialController.crearHistorial);
router.put("/:id", historialController.actualizarHistorial);
router.delete("/:id", historialController.eliminarHistorial);

module.exports = router;
