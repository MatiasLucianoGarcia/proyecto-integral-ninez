const express = require("express");
const router = express.Router();
const personaController = require("../controllers/personaController");
const { authenticate } = require("../middlewares/authMiddleware");
const validar = require("../middlewares/validatorMiddleware");
const {
  createPersonaSchema,
  updatePersonaSchema,
} = require("../validators/personaSchema");

// Todos los roles pueden acceder
router.get("/", authenticate, personaController.getPersonas);
router.post(
  "/",
  authenticate,
  validar(createPersonaSchema),
  personaController.createPersona
);
router.put(
  "/:dni",
  authenticate,
  validar(updatePersonaSchema),
  personaController.updatePersona
);
router.delete("/:dni", authenticate, personaController.deletePersona);
router.get("/:dni", authenticate, personaController.getPersonaByDNI);

module.exports = router;
