const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const sendMail = function (
  subject,
  sendTo,
  template,
  userName,
  link,
  filename,
  filePath,
  fileTitle,
  fileDescription
) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //handlebar options for email templates
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: "views",
      layoutsDir: "views",
      defaultLayout: null,
    },
    viewPath: "Views",
    extName: ".hbs",
  };

  //configuring transporter to use hbs
  transporter.use("compile", hbs(handlebarOptions));

  //email sending options
  const emailOptions = {
    from: {
      name: "Lizzy's Files",
      address: process.env.EMAIL_USER,
    },
    to: sendTo,
    subject: subject,
    replyTo: "noreply@gmail.com",
    template: template,
    context: {
      userName,
      link,
      fileTitle,
      fileDescription,
    },
  };

  if (filename || fileDescription) {
    emailOptions.attachments = [
      {
        filename: filename,
        path: filePath,
      },
    ];
  }

  //send Email
 return transporter.sendMail(emailOptions);
};

module.exports = sendMail;
