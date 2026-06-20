import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const auth = new Hono();

// REGISTER
auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json(
        {
          success: false,
          message: "User already exists",
        },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await prisma.organization.create({
      data: {
        name: `${email}-org`,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        organizationId: organization.id,
      },
    });

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
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

// LOGIN
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
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

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        400
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      "SECRET_KEY"
    );

    return c.json({
      success: true,
      token,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Something went wrong",
      },
      500
    );
  }
});

export default auth;