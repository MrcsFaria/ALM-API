import bcrypt from "bcrypt";
import { createUser, findUserByEmail, updateToken } from "../models/User.js";

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
