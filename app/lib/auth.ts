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
    process.env.AKASH_USER_ID &&
    username === process.env.AKASH_USER_ID &&
    process.env.AKASH_USER_PASSWORD &&
    password === process.env.AKASH_USER_PASSWORD
  ) {
    return process.env.AKASH_USER_ID;
  }

  return null;
};
