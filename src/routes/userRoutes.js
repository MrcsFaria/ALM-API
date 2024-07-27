import { Router } from "express";

import { findAllUsers, findUserByEmail } from "../models/User.js";

const router = Router();

router.get("/users", findAllUsers);

router.get('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await findUserByEmail(email);

        if (user) {
            res.json({ 
            nome: user.nome,
            email: user.email,
            password_hash: user.password_hash,
             });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});



export default router;