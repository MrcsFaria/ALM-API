import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from 'bcrypt';
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import prodRoutes from "./routes/prodRoutes.js";
import sgMail from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();
server.use(cors());
server.use(express.json());
server.use(fileUpload());

server.use(express.static(__dirname + "/public"));

server.use("/", prodRoutes);
server.use("/", authRoutes);
server.use("/", userRoutes);

function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

server.post('/send', async (req, res) => {
  const { email } = req.body;
  const code = generateRandomCode();

  const msg = {
      to: email,
      from: 'botprojects@outlook.com',
      subject: 'Recuperação de Senha',
      text: `Olá, \n\nVocê solicitou a recuperação de senha. Use o código a seguir para recuperar sua senha: ${code}\n\nSe você não solicitou a recuperação, por favor ignore este e-mail.`,
      html: `<p>Olá,</p>
             <p>Você solicitou a recuperação de senha. Use o código a seguir para recuperar sua senha:</p>
             <h2>${code}</h2>
             <p>Se você não solicitou a recuperação, por favor ignore este e-mail.</p>`,
  };

  try {
      await sgMail.send(msg);
      res.status(200).send('Email enviado com sucesso!');
  } catch (error) {
      console.error(error);
      if (error.response) {
          console.error(error.response.body);
      }
      res.status(500).send('E-mail não encontrado no banco de dados.');
  }
});

app.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
      const isCodeValid = await verifyCode(email, code);
      
      if (!isCodeValid) {
          return res.status(400).send('Código inválido');
      }
      
      res.status(200).send('Email enviado com sucesso!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao processar a solicitação');
  }
});

async function verifyCode(email, code) {
  // Implemente a lógica para verificar o código
  // Isso geralmente envolve consultar o banco de dados para ver se o código corresponde ao e-mail
  // Retorne true se o código for válido, caso contrário, false
  return true;
}

server.listen(process.env.PORT, () => {
  console.log(`Rodando na porta: ${process.env.BASE}`);
});
