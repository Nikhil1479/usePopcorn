const nodemailer = require("nodemailer");

async function sendEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nikkhiilgupta@gmail.com", // Your email
        pass: "Niks1479@", // Your App Password
      },
    });

    let info = await transporter.sendMail({
      from: '"noreply-git-nikhil" <nikkhiilgupta@gmail.com>', // Sender name and email
      to: "nikhil956839@gmail.com", // Recipient's email
      subject: "Code pushed or pull request created on master",
      text: "Code has been pushed to the master branch or a pull request has been created targeting the master branch.",
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

sendEmail();
