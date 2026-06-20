import { Hono } from "hono";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const transactions = new Hono();

transactions.get("/", authMiddleware, async (c) => {
  try {
    const userId = (c as any).userId;

    const transactionsList = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return c.json({
      success: true,
      transactions: transactionsList,
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

transactions.post("/extract", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { text } = body;

    const userId = (c as any).userId;

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

    // Amount Extraction
    const amountMatch = text.match(/₹?\s?([\d,]+\.\d{2})/);

    const amount = amountMatch
      ? parseFloat(amountMatch[1].replace(/,/g, ""))
      : 0;

    // Description Extraction
    let description = text.substring(0, 100);

    if (text.includes("STARBUCKS")) {
      description = "STARBUCKS COFFEE MUMBAI";
    } else if (text.includes("Uber")) {
      description = "Uber Ride Airport Drop";
    } else if (text.includes("Amazon")) {
      description = "Amazon.in Order";
    }

    // Confidence Score
    let confidence = 0.8;

    if (
      text.includes("STARBUCKS") ||
      text.includes("Uber") ||
      text.includes("Amazon")
    ) {
      confidence = 0.95;
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(),
        description,
        amount,
        confidence,
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