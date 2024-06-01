const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const sendMail = async function (subject, sendTo, template, name, link) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL.PORT,
    auth: {
      user: process.env.EMAIL.USER,
      pass: process.env.EMAIL.PASS,
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
      address: "danielsah118@outlook.com",
    },
    to: sendTo,
    subject: subject,
    replyTo: "noreply@gmail.com",
    template: template,
    context: {
      name,
      link,
    },
  };

  //send Email
  transporter.sendMail(emailOptions, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

module.exports= sendMail