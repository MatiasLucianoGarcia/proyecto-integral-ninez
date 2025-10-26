const personaService = require("../services/personaService");
const historialService = require("../services/historialService");
const interesesService = require("../services/interesesService");
const saludService = require("../services/saludService");
const condicionesVidaService = require("../services/condicionesVidaService");

// GET
const getPersonas = async (req, res) => {
  try {
    const personas = await personaService.getPersonas();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener personas", error });
  }
};

// POST
const createPersona = async (req, res) => {
  try {
    const nueva = await personaService.createPersona(req.body);

    await interesesService.crearIntereses(nueva.dni);
    await saludService.crearSalud(nueva.dni);
    await condicionesVidaService.crearCondicionesVida(nueva.dni);

    const intervencion = `El usuario ${req.user.nombre} ingresó a ${nueva.nombre} (${nueva.dni}) al sistema`;
    await historialService.createHistorial({
      dni: nueva.dni,
      intervencion,
      resultado: "Alta de persona y registros asociados exitosa",
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al crear persona",
    });
  }
};

// PUT
const updatePersona = async (req, res) => {
  try {
    const actualizada = await personaService.updatePersona(req.params.dni, req.body);
    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar persona",
    });
  }
};

// DELETE
const deletePersona = async (req, res) => {
  try {
    const resultado = await personaService.deletePersona(req.params.dni);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error al eliminar persona",
    });
  }
};

const getPersonaByDNI = async (req, res) => {
  try {
    const persona = await personaService.getPersonaByDNI(req.params.dni);
    if (persona) {
      console.log("Persona encontrada:", persona);
      res.json(persona);
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener persona", error });
  }
};

module.exports = {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
  getPersonaByDNI,
};
