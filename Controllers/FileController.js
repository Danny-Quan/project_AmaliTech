const fs = require("fs");
const http = require("http");
const path = require("path");
const File = require("../Models/FileModel");
const sendMail = require("../Utils/sendMail");

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
      console.log("file");
      var fileSize = req.file.size;
      var filePath = req.file.filename;
    }
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { title, description, fileSize, filePath },
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
    const { key } = req.params;
    //using the aggregation middleware in mongoose for search functionality
    const files = await File.aggregate([
      {
        $search: {
          index: "default",
          text: { query: key, path: { wildcard: "*" } },
        },
      },
    ]);
    if (!file) throw new Error("no file found");
    res.status(200).json({
      status: "success",
      file,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const { filename, fileId } = req.params;
    const downloadableFile = await File.findById(fileId);
    if (!downloadableFile) throw new Error("file not found");

    //building downloadable url
    let url = path.join(__dirname, "..", "public/uploads", filename);
    console.log(encodeURI(url));

    //fetching file
    const file = fs.createWriteStream(filename);
    http.get(encodeURI(url), (res) => {
      res.pipe(file);

      //after download close filestream
      filePath.on("finish", () => {
        file.close();
        console.log("Download Completed");
      });
    });

    //download counter
    //incrementing download counts
    downloadableFile.downloads++;
    await downloadableFile.save();

    res.status(200).send("Ok");
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.sendFileToEmail = async (req, res, next) => {
  try {
    const { receiverEmail, fileId } = req.body;
    //validating receiver's email field
    if (!receiverEmail) throw new Error("Receiver email is required");

    //checking for valid email
    const validEmail = email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!validEmail) throw new Error("Enter a valid email");

    //find file
    const fileToSend = await File.findById(fileId);
    if (!fileToSend) throw new Error("file not found");

    //send email to receiver
    await sendMail(
      (subject = "File Received from Lizzy's Files"),
      (sendTo = receiverEmail),
      (template = "sendFile"),
      (filename = fileToSend.filePath),
      (filePath = encodeURI(fileToSend.filePath)),
      (fileTitle = fileToSend.title),
      (fileDescription = fileToSend.description)
    );

    //incrementing emails sent counter
    fileToSend.emailsSent++;
    await fileToSend.save();

    res.status(200).send("File sent");
  } catch (error) {
    res.status(400);
    next(error);
  }
};
