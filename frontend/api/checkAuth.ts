import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;

  if (token) {
    return res.status(200).json({ message: "Authenticated" });
  }

  return res.status(401).json({ message: "Unauthorized" });
}
