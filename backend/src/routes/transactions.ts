import { Hono } from "hono";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const transactions = new Hono();

transactions.post("/extract", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { text } = body;

    const userId = (c as any).userId as string;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        404
      );
    }

    // Temporary extraction logic
    const amountMatch = text.match(/(\d+[,.]?\d*)/);

    const amount = amountMatch
      ? parseFloat(amountMatch[0].replace(",", ""))
      : 0;

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(),
        description: text.substring(0, 100),
        amount,
        confidence: 0.8,
        userId: user.id,
        organizationId: user.organizationId,
      },
    });

    return c.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        success: false,
        message: "Something went wrong",
      },
      500
    );
  }
});

export default transactions;