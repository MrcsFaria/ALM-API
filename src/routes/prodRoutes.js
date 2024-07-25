import { Router } from 'express';
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/products', async (req, res) => {
  const { marca, categoryId } = req.query; // Obtenha os parâmetros de consulta 'marca' e 'catId'

  try {
    let products;

    if (marca) {
      products = await prisma.product.findMany({
        where: {
          marca: marca.toString(), // Filtra pelos produtos da marca especificada
        },
      });
    } else if (categoryId) {
      products = await prisma.product.findMany({
        where: {
          categoryId: parseInt(categoryId), // Converte para número e filtra pelo ID da categoria
        },
      });
    } else {
      products = await prisma.product.findMany(); // Retorna todos os produtos se não houver filtro
    }

    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});



router.get('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id); // Obtém o ID do parâmetro da URL

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Erro ao buscar o produto:", error);
    res.status(500).json({ error: "Erro ao buscar o produto" });
  }
});

export default router;