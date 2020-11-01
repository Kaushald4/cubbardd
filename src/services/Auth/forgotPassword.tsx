import { BASE_URI } from "./uri";

export const forgotPassword = async ({ email }: { email: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });
};
