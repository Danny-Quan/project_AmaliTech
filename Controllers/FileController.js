const fs = require("fs");
const File = require("../Models/FileModel");
const { Dropbox } = require("dropbox");
const sendMail = require("../Utils/sendMail");
const fetch = require("isomorphic-fetch");
const refreshAccessToken = require("../Utils/dropboxConfig");

exports.uploadFile = async function (req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      throw new Error("All fields are required");
    }
    //check if a file was uploaded
    if (!req.file) {
      throw new Error("File not uploaded");
    }

    const fileSize = req.file.size;
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const fileContent = fs.readFileSync(req.file.path);

    //get access token
    const accessToken = await refreshAccessToken();

    //configuring dropbox
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch,
    });
    // Upload file to Dropbox
    const response = await dbx.filesUpload({
      path: "/" + fileName,
      contents: fileContent,
      mode: { ".tag": "overwrite" },
    });

    // Remove the file from the server after uploading to Dropbox
    fs.unlinkSync(filePath, (err) => {
      if (err) {
        console.log("Error deleting temporal file");
      }
    });

    // Generate a shared link for the uploaded file
    const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
      path: "/" + fileName,
    });
    // console.log(sharedLink.result.url);

    //create file
    const newFile = await File.create({
      adminId: req.user._id,
      title,
      description,
      fileName,
      fileSize,
      filePath: sharedLink.result.url,
    });
    if (!newFile) {
      throw new Error("Error uploading file");
    }
    res.status(201).json({
      status: "success",
      message: "File upload successfully",
      newFile,
    });
  } catch (error) {
    try {
      // Clean up the temporary file if upload to Dropbox fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (clearnupError) {
      console.log("There was an error cleaning up file");
    }
    res.status(400);
    next(error);
  }
};

exports.getAllFiles = async function (req, res, next) {
  try {
    //get all files from database
    const allFiles = await File.find();
    if (!allFiles) throw new Error("An error occurred");
    //return files if on success
    res.status(200).json({
      status: "success",
      files_Length: allFiles.length,
      Files: allFiles,
    });
  } catch (error) {
    //throw error if on error
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

    let fileSize;
    let fileName;
    let sharedLink;
    if (req.file) {
      //update image
      fileSize = req.file.size;
      const filePath = req.file.path;
      fileName = req.file.filename;
      const fileContent = fs.readFileSync(req.file.path);

      //get access token
      const accessToken = await refreshAccessToken();

      //configuring dropbox
      const dbx = new Dropbox({
        accessToken: accessToken,
        fetch,
      });
      // Upload file to Dropbox
      const response = await dbx.filesUpload({
        path: "/" + fileName,
        contents: fileContent,
        mode: { ".tag": "overwrite" },
      });

      // Remove the file from the server after uploading to Dropbox
      fs.unlinkSync(filePath, (err) => {
        if (err) {
          console.log("Error deleting temporal file");
        }
      });

      // Generate a shared link for the uploaded file
      sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
        path: "/" + fileName,
      });
    }

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      {
        title,
        description,
        fileSize: fileSize,
        filePath: sharedLink?.result?.url,
        fileName: fileName,
      },
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
    try {
      // Clean up the temporary file if upload to Dropbox fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (clearnupError) {
      console.log("There was an error cleaning up file");
    }
    res.status(400);
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    //find item in database and delete
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) throw new Error("an error occurred");
    //return status if on success
    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error) {
    //return error if on error
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
    const downloadableFile = await File.findById(fileId);
    if (!downloadableFile) throw new Error("file not found");

    try {
      //get access token
      const accessToken = await refreshAccessToken();

      //configuring dropbox
      const dbx = new Dropbox({
        accessToken: accessToken,
        fetch,
      });

      var downloadResponse = await dbx.filesDownload({
        path: `/${filename}`,
      });
      // console.log(downloadResponse);
      console.log("file downloaded successfully");
    } catch (error) {
      // console.log(error);
      console.log("error downloading file");
    }

    const fileData = downloadResponse.result.fileBinary;
    // console.log(fileData)
    
    //setting download headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(fileData);

    //incrementing download counts
    downloadableFile.downloads++;
    await downloadableFile.save();

    res.status(200);
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
