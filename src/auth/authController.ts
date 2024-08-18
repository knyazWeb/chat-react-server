import { registerUser, updateUser } from "./authService";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  try {
    const newUser = await registerUser(email, password, username);
    res.status(201).json({ user: newUser });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    res.status(500).json({ error: "An error occurred" });
  }
};

export const update = async (req: Request, res: Response) => {
  const { currentEmail, password, username, email } = req.body;
  try {
    const updatedUser = await updateUser(
      currentEmail,
      username,
      email,
      password,
    );
    res.status(201).json({ user: updatedUser });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    res.status(500).json({ error: "An error occurred" });

  }
};
