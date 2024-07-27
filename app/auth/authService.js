import { prisma } from "../utils/prisma.js";
import { supabase } from "../utils/supabase.js";

export const registerUser = async (email, password, username) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: username,
        },
      },
    });

    console.log(`User: ${username} with email: ${email} was signup `);
    if (error) {
      throw new Error(error.message);
    }

    const newUser = await prisma.user.create({
      data: {
        authId: data.user.id,
        email: data.user.email,
        username: username,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
