import * as jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../api";
import { JWT_SIGNING_KEY } from "../../config";

export interface LoginResponse {
  accessToken: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  const email = req.body.email;

  const user: User = { email };

  const accessToken = jwt.sign({ user }, JWT_SIGNING_KEY, {
    expiresIn: 60 * 60, // 1hr
  });

  res.status(200).json({ accessToken: accessToken });
}
