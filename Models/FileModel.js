const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "A file require a title"],
    },
    description: {
      type: String,
      required: [true, "A file require a description"],
    },
    fileSize: {
      type: Number,
    },
    filePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("file", fileSchema);
module.exports = File;
