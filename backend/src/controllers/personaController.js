const personaService = require("../services/personaService");
const historialService = require("../services/historialService");
const interesesService = require("../services/interesesService");
const saludService = require("../services/saludService");
const condicionesVidaService = require("../services/condicionesVidaService");

const getPersonas = async (req, res) => {
  try {
    const personas = await personaService.getPersonas();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener personas", error });
  }
};

const createPersona = async (req, res) => {
  try {
    const nueva = await personaService.createPersona(req.body);

    // Crear registros asociados vacíos
    await interesesService.crearIntereses(nueva.dni);
    await saludService.crearSalud(nueva.dni);
    await condicionesVidaService.crearCondicionesVida(nueva.dni);

    // Historial
    const intervencion = `El usuario ${req.user.nombre} ingresó a ${nueva.nombre} (${nueva.dni}) al sistema`;
    await historialService.createHistorial({
      dni: nueva.dni,
      intervencion,
      resultado: "Alta de persona y registros asociados exitosa",
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear persona", error });
  }
};

const updatePersona = async (req, res) => {
  try {
    const actualizada = await personaService.updatePersona(
      req.params.dni,
      req.body
    );
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar persona", error });
  }
};

const deletePersona = async (req, res) => {
  try {
    await personaService.deletePersona(req.params.dni);
    res.json({ message: "Persona eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar persona", error });
  }
};

module.exports = {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
};
