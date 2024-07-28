import {registerUser} from "./authService.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const newUser = await registerUser(email, password, username);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

