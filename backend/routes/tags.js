const router = require("express").Router();
const authenticationRequired = require("../utils/authenticationRequired");
const prisma = require("../utils/prisma");

// Get all tags
router.get("/", authenticationRequired, async (req, res, next) => {
  try {
    // Find all tags
    const tags = await prisma.tag.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        ItemTags: true,
      },
    });
    // Return the tags
    res.json(tags);
  } catch (e) {
    next(e);
  }
});

// Create a new tag
router.post("/", authenticationRequired, async (req, res, next) => {
  try {
    // Check if there already exists a tag with the same name
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    if (existingTag) {
      // If it exists, return error
      return res.status(400).json({
        message: "Tag already exists",
      });
    }
    // Create a new tag
    const tag = await prisma.tag.create({
      data: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    // Return the tag
    res.json(tag);
  } catch (e) {
    next(e);
  }
});

// Get a tag by id
router.get("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the tag by id
    const tag = await prisma.tag.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        ItemTags: true,
      },
    });
    // If the tag does not exist, return error
    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    // Populate the items for the tag
    tag.items = tag.ItemTags.map((itemTag) => {
      const item = prisma.item.findUnique({
        where: {
          userId: req.user.id,
          id: itemTag.itemId,
        },
      });
      return item;
    });
    // Return the tag
    res.json(tag);
  } catch (e) {
    next(e);
  }
});

// Update a tag by id
router.put("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the tag by id
    const tag = await prisma.tag.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    // If the tag does not exist, return error
    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    // Update the tag
    const updatedTag = await prisma.tag.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
      },
    });
    // Return the updated tag
    res.json(updatedTag);
  } catch (e) {
    next(e);
  }
});

// Delete a tag by id
router.delete("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the tag by id
    const tag = await prisma.tag.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    // If the tag does not exist, return error
    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    // Check if the tag is associated with any items
    const itemTags = await prisma.itemTag.findMany({
      where: {
        tagId: req.params.id,
      },
    });
    // If the tag is associated with any items, return error
    if (itemTags.length > 0) {
      return res.status(400).json({
        message: "Tag is associated with items",
      });
    }
    // Delete the tag
    await prisma.tag.delete({
      where: {
        id: req.params.id,
      },
    });
    // Return success message
    res.json({
      message: "Tag deleted",
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
