import jwt from "jsonwebtoken";

export const authMiddleware = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json(
        {
          success: false,
          message: "No token provided",
        },
        401
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      "SECRET_KEY"
    ) as {
      userId: string;
    };

   (c as any).userId = decoded.userId;

    await next();
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Invalid token",
      },
      401
    );
  }
};