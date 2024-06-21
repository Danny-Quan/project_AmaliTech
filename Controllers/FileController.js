const File = require("../Models/FileModel");
const sendMail = require("../Utils/sendMail");

exports.uploadFile = async function (req, res, next) {
  try {
    // console.log(req.file);
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
      fileName: req.file.filename,
      fileSize,
      filePath: req.file.path,
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
    // console.log(fileId)
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
    if (!deletedFile) throw new Error("an error occurred");
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
          index: "files",
          text: { query: key, path: { wildcard: "*" } },
        },
      },
    ]);
    if (!files) throw new Error("no file found");
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const { filename, fileId } = req.params;
    console.log(filename,fileId)
    const downloadableFile = await File.findById(fileId);
    if (!downloadableFile) throw new Error("file not found");

    console.log("FILE PATH => "+ downloadable.filePath)
    res.download(downloadableFile.filePath, filename,(err)=>{
      if(err){
        console.log(err)
        return res.status(500).json({message:"Error downloading file"})
      }
      console.log('Download initiated!')
    }
    )
    //incrementing download counts
    downloadableFile.downloads++;
    await downloadableFile.save();

    // res.status(200).send("ok");
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
    const validEmail = receiverEmail.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!validEmail) throw new Error("Enter a valid email");

    //find file
    const fileToSend = await File.findById(fileId);
    if (!fileToSend) throw new Error("file not found");

    //send email to receiver
    await sendMail(
      (subject = "File Received from Lizzy's File Hub"),
      (sendTo = receiverEmail),
      (template = "sendFile"),
      (userName = ""),
      (link = ""),
      (filename = fileToSend.fileName),
      (filePath = fileToSend.filePath),
      (fileTitle = fileToSend.title),
      (fileDescription = fileToSend.description)
    )
      .then(console.log("message sent"))
      .catch((error) => {
        console.log(error);
        throw new Error("An error occurred while sending email");
      });

    //incrementing emails sent counter
    fileToSend.emailsSent++;
    await fileToSend.save();

    res.status(200).send("File sent");
  } catch (error) {
    res.status(400);
    next(error);
  }
};
