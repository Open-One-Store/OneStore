const router = require("express").Router();
const { ItemType } = require("@prisma/client");
const authenticationRequired = require("../utils/authenticationRequired");
const prisma = require("../utils/prisma");
const minioClient = require("../utils/minio");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Get all items
// The URL can contain query parameters to filter the items by userId, categoryId, or tagId.
router.get("/", authenticationRequired, async (req, res, next) => {
  try {
    // Set filters
    const filters = {
      where: {
        userId: req.user.id,
      },
      include: {
        Category: true,
        ItemTags: true,
      },
    };
    // Parse params: userID, categoryID, tagID
    if (req.query.userId) {
      filters.where.userId = req.query.userId;
    }
    if (req.query.categoryId) {
      filters.where.categoryId = req.query.categoryId;
    }
    if (req.query.tagId) {
      filters.where.ItemTags = {
        some: {
          tagId: req.query.tagId,
        },
      };
      filters.include = {
        ItemTags: true,
      };
    }
    if (req.query.search) {
      filters.where.OR = [
        {
          title: {
            contains: req.query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: req.query.search,
            mode: "insensitive",
          },
        },
      ];
    }
    if (req.query.itemType) {
      filters.where.itemType = req.query.itemType;
    }
    if (req.query.limit) {
      filters.take = parseInt(req.query.limit);
    }
    if (req.query.offset) {
      filters.skip = parseInt(req.query.offset);
    }
    if (req.query.orderBy) {
      filters.orderBy = {
        [req.query.orderBy]: req.query.orderDirection || "asc",
      };
    }
    // Find all items that belong to the logged in user
    const items = await prisma.item.findMany(filters);
    // Return the items
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Create a new item
router.post(
  "/",
  authenticationRequired,
  upload.single("file"),
  async (req, res, next) => {
    try {
      // Create a new item in the Database
      const itemData = await prisma.item.create({
        data: {
          title: req.body.name,
          description: req.body.description,
          userId: req.user.id,
          categoryId: req.body.categoryId == "" ? null : req.body.categoryId,

          itemType: ItemType[req.body.itemType],
        },
      });
      switch (req.body.itemType) {
        case "file":
          {
            // Upload the file, if the item type is file
            try {
              // Name format: <userId>/<category_id?>/<itemId>/<time>.<type>
              const fileName = `${req.user.id}${
                req.body.categoryId && req.body.categoryId !== ""
                  ? `/${itemData.categoryId}/`
                  : "/"
              }${itemData.id}/${new Date().getTime()}.${
                req.file.mimetype.split("/")[1]
              }`;
              // Upload the file
              const minioObj = await minioClient.putObject(
                process.env.MINIO_BUCKET,
                fileName,
                req.file.buffer,
                req.file.size
              );
              // Once uploaded, set the file path in the database
              const item = await prisma.item.update({
                where: {
                  id: itemData.id,
                },
                data: {
                  filePath: fileName,
                },
              });
              res.json(item);
            } catch (e) {
              // If upload fails, then delete the object from the database
              prisma.item.delete({
                where: {
                  id: itemData.id,
                },
              });
              // Return Error
              next(new Error("Upload Failed"));
            }
          }
          break;
        case "text":
          {
            const item = await prisma.item.update({
              where: {
                id: itemData.id,
              },
              data: {
                text: req.body.text,
              },
            });
            res.json(item);
          }
          break;
        case "link":
        case "video":
        case "other":
          {
            // Update the item with the link
            const item = await prisma.item.update({
              where: {
                id: itemData.id,
              },
              data: {
                url: req.body.link,
              },
            });
            res.json(item);
          }
          break;
        default:
          next(Error("Something is wrong here..."));
      }
    } catch (e) {
      next(e);
    }
  }
);

async function getItemTags(itemId) {
  const itemTags = await prisma.itemTag.findMany({
    where: {
      itemId: itemId,
    },
  });
  const tags = [];
  for (const itemTag of itemTags) {
    const tag = await prisma.tag.findUnique({
      where: {
        id: itemTag.tagId,
      },
    });
    tags.push(tag);
  }
  return tags;
}

// Get item by ID
router.get("/:id", authenticationRequired, async (req, res, next) => {
  try {
    // Find the item by ID
    const item = await prisma.item.findUnique({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
      include: {
        Category: true,
        ItemTags: true,
      },
    });
    if (!item) {
      // If item not found, return 404
      return res.status(404).json({ message: "Item not found" });
    }
    // Populate the tags
    item.tags = await getItemTags(item.id);
    if (item.itemType === "file") {
      // If the item is a file, then get the file URL
      item.fileUrl = await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET,
        item.filePath,
        3 * 60 * 60 // Valid for 3 hours
      );
    }
    // Return the item
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Update item by ID
router.put("/:id", authenticationRequired, async (req, res, next) => {
  try {
    const existItem = await prisma.item.findUnique({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });
    if (!existItem) {
      // If item not found, return 404
      return res.status(404).json({ message: "Item not found" });
    }
    // Update the item
    const updateFields = {
      title: req.body.name,
      description: req.body.description,
    };
    if (existItem.itemType === "text" && req.body.text) {
      updateFields.text = req.body.text;
    }
    if (
      (existItem.itemType === "link" ||
        existItem.itemType === "video" ||
        existItem.itemType === "other") &&
      req.body.link
    ) {
      updateFields.url = req.body.link;
    }
    const item = await prisma.item.update({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
      data: updateFields,
    });
    // Return the updated item
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Delete item by ID
router.delete("/:id", authenticationRequired, async (req, res, next) => {
  try {
    const existItem = await prisma.item.findUnique({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });
    if (!existItem) {
      // If item not found, return 404
      return res.status(404).json({ message: "Item not found" });
    }
    if (existItem.itemType === "file") {
      // If the item is a file, then delete the file from Minio
      await minioClient.removeObject(
        process.env.MINIO_BUCKET,
        existItem.filePath
      );
    }
    // Delete the item from the database
    await prisma.item.delete({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });
    // Return success
    res.json({ message: "Item deleted" });
  } catch (e) {
    next(e);
  }
});

// Add Tag to Item
router.post("/:id/tags", authenticationRequired, async (req, res, next) => {
  try {
    const existItem = await prisma.item.findUnique({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });
    if (!existItem) {
      // If item not found, return 404
      return res.status(404).json({ message: "Item not found" });
    }
    // Add the tag to the item
    const itemTag = await prisma.itemTag.create({
      data: {
        itemId: req.params.id,
        tagId: req.body.tagId,
      },
    });
    // Return the item tag
    res.json(itemTag);
  } catch (e) {
    next(e);
  }
});

// Remove Tag from Item
router.delete(
  "/:id/tags/:tagId",
  authenticationRequired,
  async (req, res, next) => {
    try {
      const existItem = await prisma.item.findUnique({
        where: {
          userId: req.user.id,
          id: req.params.id,
        },
      });
      if (!existItem) {
        // If item not found, return 404
        return res.status(404).json({ message: "Item not found" });
      }
      // Remove the tag from the item
      await prisma.itemTag.delete({
        where: {
          itemId: req.params.id,
          tagId: req.params.tagId,
        },
      });
      // Return success
      res.json({ message: "Tag removed" });
    } catch (e) {
      next(e);
    }
  }
);

// Set category for item
router.put("/:id/category", authenticationRequired, async (req, res, next) => {
  try {
    const existItem = await prisma.item.findUnique({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });
    if (!existItem) {
      // If item not found, return 404
      return res.status(404).json({ message: "Item not found" });
    }
    // Update the category
    const item = await prisma.item.update({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
      data: {
        categoryId: req.body.categoryId,
      },
    });
    // Return the updated item
    res.json(item);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
