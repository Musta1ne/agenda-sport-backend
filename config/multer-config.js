const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary-config");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "football_fields",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

module.exports = upload;
