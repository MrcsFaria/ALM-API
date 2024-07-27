import bcrypt from "bcrypt";
import { createUser, findUserByEmail, updateToken, createReset } from "../models/User.js";
import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const signup = async (req, res) => {
  try {
    const data = req.body;
    const user = await findUserByEmail(data.email);

    if (user) {
      res.status(500).json({
        error: "Email already exists!",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    // Criar o usuário
    const newUser = await createUser({
      nome: data.nome,
      email: data.email,
      passwordHash,
      token,
      cpf: data.cpf,
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const data = req.body;
    // Verificar se o email existe
    const user = await findUserByEmail(data.email);
    if (!user) {
      res.status(500).json({ error: "Email or password invalid!" });
      return;
    }

    // Verificar se a senha está correta
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      res.status(500).json({ error: "Email or password invalid!" });
      return;
    }

    // Gerar um novo token
    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);
    await updateToken(user.id, token);

    // Retornar o status
    res.status(200).json({ userId: user.id, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in", message: error.message });
  }
};

export const handleResetRequest = async (req, res) => {
  const { email } = req.body;
  const code = generateRandomCode(); // Gera um código de recuperação

  try {
    // Cria um novo reset no banco de dados
    await createReset({
      email: email,
      code: code,
    });

    // Envia o e-mail com o código
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

    await sgMail.send(msg);
    res.status(200).send('Email enviado e código de recuperação armazenado com sucesso!');
  } catch (error) {
    console.error('Erro ao processar solicitação de recuperação:', error);
    res.status(500).send('Erro ao processar solicitação de recuperação.');
  }
};

// Função para gerar um código de recuperação aleatório
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
