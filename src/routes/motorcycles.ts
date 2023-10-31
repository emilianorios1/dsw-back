import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

router.get("/motorcycles", async (req, res) => {
  const motorcycles = await prisma.motorcycle.findMany();
  res.send(motorcycles);
});

router.get("/motorcycles/:id", async (req, res) => {
  const motorcycle = await prisma.motorcycle.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.send(motorcycle);
});

router.post("/motorcycles", async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { model, manufacturer, year, topSpeed, weight } = req.body;

    if (!model) {
      return res.status(400).json({ error: "Model is required" });
    }

    // Check if the motorcycle with the same model already exists
    const existingMotorcycle = await prisma.motorcycle.findUnique({
      where: { model: model },
    });

    if (existingMotorcycle) {
      return res
        .status(409)
        .json({ error: "Motorcycle with the same model already exists" });
    }

    // Create the motorcycle
    const motorcycle = await prisma.motorcycle.create({
      data: {
        model: model,
        manufacturer: manufacturer,
        year: year,
        topSpeed: topSpeed,
        weight: weight,
        // Other fields if necessary
      },
    });

    // Return the created motorcycle
    res.status(201).json(motorcycle);
  } catch (error) {
    console.error("Error creating motorcycle:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/motorcycles/:id", async (req, res) => {
  const motorcycleId = parseInt(req.params.id);
  const updatedMotorcycleData = req.body;

  try {
    const existingMotorcycle = await prisma.motorcycle.findUnique({
      where: { id: motorcycleId },
    });

    if (!existingMotorcycle) {
      return res.status(404).json({ error: "Motorcycle not found" });
    }

    // Check if the updated model already exists in another motorcycle
    if (updatedMotorcycleData.model) {
      const motorcycleWithSamemodel = await prisma.motorcycle.findFirst({
        where: {
          NOT: { id: motorcycleId },
          model: updatedMotorcycleData.model,
        },
      });

      if (motorcycleWithSamemodel) {
        return res
          .status(409)
          .json({ error: "Motorcycle with the same model already exists" });
      }
    }

    const motorcycle = await prisma.motorcycle.update({
      where: { id: motorcycleId },
      data: updatedMotorcycleData,
    });

    res.json(motorcycle); // Return the updated motorcycle
  } catch (error) {
    console.error("Error updating motorcycle:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/motorcycles/:id", async (req, res) => {
  const motorcycleId = parseInt(req.params.id);

  try {
    // First, check if the motorcycle with the specified ID exists
    const existingMotorcycle = await prisma.motorcycle.findUnique({
      where: { id: motorcycleId },
    });

    if (!existingMotorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    // If the motorcycle exists, delete it
    await prisma.motorcycle.delete({
      where: { id: motorcycleId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
