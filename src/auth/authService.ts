import { prisma } from "../utils/prisma";
import { supabase } from "../utils/supabase";

export const registerUser = async (
  email: string,
  password: string,
  username: string,
) => {
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

    return await prisma.user.create({
      data: {
        authId: data.user?.id as string,
        email: data.user?.email as string,
        username: username,
      },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An error occurred");
  }
};

export const updateUser = async (
  currentEmail: string,
  username: string,
  email: string,
  password: string,
) => {
  try {
    const userData = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: password,
    });

    if (userData.error) {
      throw new Error(userData.error.message);
    }

    const updatedData = await supabase.auth.updateUser({
      email: email,
      data: {
        first_name: username,
      },
    });

    if (updatedData.error) {
      throw new Error(updatedData.error.message);
    }
    return updatedData.data.user;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An error occurred");
  }
};
