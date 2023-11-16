const Sib = require("sib-api-v3-sdk");

const sendEmail = async (req, res) => {
  try {
    const client = Sib.ApiClient.instance;
    const apikey = client.authentications["api-key"];
    apikey.apiKey = process.env.SIB_APIKEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "imankur.ak@gmail.com",
      name: "Ankur",
    };
    const receivers = [{ email: req.body.email }];
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Reset Your Password",
      textContent: "Link Below",
    });
    console.log(emailResponse);
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendEmail };
