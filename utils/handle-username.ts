import { checkUsername } from "@/lib/actions/user";

export const generateUniqueUsername = async (): Promise<string> => {
  let unique = false;
  let newUsername = "";

  while (!unique) {
    newUsername = generateRandomUsername();
    unique = !(await checkUsername(newUsername));
  }

  return newUsername;
};
const generateRandomUsername = () => {
  return "user" + Math.floor(Math.random() * 1000000);
};
