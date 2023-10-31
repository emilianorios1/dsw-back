import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/brands', async (req,res) => {
  try {
    const brands = await prisma.brand.findMany()
    res.send(brands)
} catch (error) {
  console.error('Error finding Car Models:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    return res.status(400).json({ error: error.message });
  }

  // Handle other errors
  res.status(500).json({ error: 'Internal server error' });
}
})

router.get('/brands/:id', async (req,res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(brand)
} catch (error) {
  console.error('Error finding Car Models:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    return res.status(400).json({ error: error.message });
  }

  // Handle other errors
  res.status(500).json({ error: 'Internal server error' });
}
})

router.post('/brands', async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { name } = req.body;
    
    // Check if the brand with the same name already exists
    const existingbrand = await prisma.brand.findUnique({
      where: { name: name },
    });

    if (existingbrand) {
      return res.status(409).json({ error: 'Brand with the same name already exists' });
    }
    
    // Create the brand
    const brand = await prisma.brand.create({
      data: req.body
    });

    // Return the created brand
    res.status(201).json(brand);
  } catch (error) {
    console.error('Error creating brand:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/brands/:id', async (req, res) => {
  const brandId = parseInt(req.params.id);
  const updatedbrandData = req.body;

  try {
    const existingbrand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!existingbrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Check if the updated name already exists in another brand
    if (updatedbrandData.name) {
      const brandWithSameName = await prisma.brand.findFirst({
        where: {
          NOT: { id: brandId },
          name: updatedbrandData.name,
        },
      });

      if (brandWithSameName) {
        return res.status(409).json({ error: 'Brand with the same name already exists' });
      }
    }

    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: updatedbrandData,
    });

    res.json(brand); // Return the updated brand
  } catch (error) {
    console.error('Error updating brand:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/brands/:id', async (req, res) => {
  const brandId = parseInt(req.params.id);

  try {
    // First, check if the brand with the specified ID exists
    const existingbrand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!existingbrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const dependantCarModels = await prisma.carModel.findMany({
      where: {brandId: brandId}
    })

    if (dependantCarModels) {
      return res.status(404).json({ message: 'Please delete dependant car models before deleting this brand.'})
    }

    const dependantPlane = await prisma.planeModel.findMany({
      where: {brandId: brandId}
    })

    if (dependantPlane) {
      return res.status(404).json({ message: 'Please delete dependant plane models before deleting this brand.'})
    }

    const dependantBoatModel = await prisma.boatModel.findMany({
      where: {brandId: brandId}
    })

    if (dependantPlane) {
      return res.status(404).json({ message: 'Please delete dependant boat models before deleting this brand.'})
    }

    // If the brand exists, delete it
    await prisma.brand.delete({
      where: { id: brandId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;