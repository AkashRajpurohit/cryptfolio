export const validateCredentials = async ({
  username,
  password,
}: {
  username: string | null;
  password: string | null;
}): Promise<null | string> => {
  // For now we will just check for process.env vars instead of database and stuff
  // Validate a bit on the userId and password
  if (!username || !password) {
    return null;
  }

  if (
    process.env.USER_ID &&
    username === process.env.USER_ID &&
    process.env.USER_PASSWORD &&
    password === process.env.USER_PASSWORD
  ) {
    return process.env.USER_ID;
  }

  return null;
};
