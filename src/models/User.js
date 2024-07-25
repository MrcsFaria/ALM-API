import { prisma } from "../../config/prisma.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// Função para criar o usuário
export const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};

export const findAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};

export const updateToken = async (userId, token) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      token,
    },
  });
};

export const findUserByTokenWithRelations = async (token) => {
  return await prisma.user.findFirst({
    where: { token },
    include: {
      Ads: true,
      state: true,
    },
  });
};

export const findUserByToken = async (token) => {
  return await prisma.user.findFirst({
    where: { token },
  });
};
