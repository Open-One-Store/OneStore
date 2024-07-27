const router = require("express").Router();
const authenticationRequired = require("../utils/authenticationRequired");
const prisma = require("../utils/prisma");

// Get all categories
router.get("/", authenticationRequired, async (req, res, next) => {
  try {
    // Find all categories that belong to the logged in user
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        Items: true,
      },
    });
    // Return the categories
    res.json(categories);
  } catch (e) {
    next(e);
  }
});

// Create a new category
router.post("/", authenticationRequired, async (req, res, next) => {
  try {
    // Check if there already exists a category with the same name.
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    if (existingCategory) {
      // If it exists, return error
      return res.status(400).json({
        message: "Category already exists",
      });
    }
    // Create a new category
    const category = await prisma.category.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        userId: req.user.id,
      },
    });
    // Return the category
    res.json(category);
  } catch (e) {
    next(e);
  }
});

// Get a category by id
router.get("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the category by id
    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        Items: true,
      },
    });
    // If the category does not exist, return error
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    // Return the category
    res.json(category);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the category by id
    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    // If the category does not exist, return error
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    // Return the updated category
    res.json(updatedCategory);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the category by id
    const category = await prisma.category.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        Items: true,
      },
    });
    // If the category does not exist, return error
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    if (category.Items.length > 0) {
      return res.status(400).json({
        message: "Category has items",
      });
    }
    // Delete the category
    await prisma.category.delete({
      where: {
        id: req.params.id,
      },
    });
    // Return success message
    res.json({
      message: "Category deleted",
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
