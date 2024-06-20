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
    fileName: { 
      type: String 
    },
    fileSize: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    emailsSent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("file", fileSchema);
module.exports = File;
