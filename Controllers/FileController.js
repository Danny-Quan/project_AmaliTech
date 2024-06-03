const File = require("../Models/FileModel");

exports.uploadFile = async function (req, res, next) {
  try {
    // console.log(req.body);
    const { title, description } = req.body;
    if (!title || !description) {
      throw new Error("All fields are required");
    }
    //check if a file was uploaded
    if (!req.file) {
      throw new Error("File not uploaded");
    }
    const fileSize = req.file.size;

    //create file
    const newFile = await File.create({
      adminId: req.user._id,
      title,
      description,
      fileSize,
      filePath: req.file.filename,
    });
    if (!newFile) {
      throw new Error("Error uploading file");
    }
    res.status(201).json({
      status: "success",
      newFile,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllFiles = async function (req, res, next) {
  try {
    const allFiles = await File.find();
    if (!allFiles) throw new Error("An error occurred");
    res.status(200).json({
      status: "success",
      files_Length: allFiles.length,
      Files: allFiles,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.getSingleFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const singleFile = await File.findById(fileId);
    if (!singleFile) throw new Error("file not found");

    res.status(200).json({
      status: "success",
      singleFile,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.updateFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { title, description } = req.body;
  
    if (req.file) {
      //update image
      console.log("file")
      var fileSize = req.file.size;
      var filePath= req.file.filename;
    }
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { title, description,fileSize,filePath },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedFile) throw new Error("Error while updating file");
    res.status(200).json({
      status: "success",
      updatedFile,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) throw new Error("Error while deleting file");
    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.searchFile = async (req, res, next) => {
  try {
    const { query } = req.body;
    //using the aggregation middleware on mongoose
    const file = await File.aggregate();
    if (!file) throw new Error("file not found");
    res.status(200).json({
      status: "success",
      file,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};
