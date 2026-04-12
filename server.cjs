require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Serveur WhatsApp OK");
});

app.post("/webhook", async (req, res) => {
  const incomingMsg = req.body.Body || "";
  console.log("Message reçu :", incomingMsg);

  const twiml = new twilio.twiml.MessagingResponse();
  const reply =
    "Merci pour votre message. Un conseiller va vous repondre rapidement pour vous accompagner.";

  console.log("Réponse envoyée :", reply);
  twiml.message(reply);
  res.type("text/xml").send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});