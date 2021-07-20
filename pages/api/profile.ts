import * as jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../api";
import { JWT_SIGNING_KEY } from "../../config";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const header = req.headers.authorization ?? "";

  const accessToken = header.startsWith("Bearer ")
    ? header.substring("Bearer ".length)
    : null;

  if (!accessToken) {
    res.status(401).end();
    return;
  }

  try {
    const payload = jwt.verify(accessToken, JWT_SIGNING_KEY) as jwt.JwtPayload;

    const user = payload.user as User;

    res.status(200).json(user);
  } catch (e) {
    res.status(401).end();
  }
}
