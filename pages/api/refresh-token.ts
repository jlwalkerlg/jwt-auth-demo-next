import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../api";
import { JWT_SIGNING_KEY } from "../../config";
import refreshTokens from "../../data/refresh-tokens";

export interface RefreshTokenResponse {
  accessToken: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshTokenResponse>
) {
  const cookies = new Cookies(req, res);

  const refreshToken = cookies.get("refresh_token");

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    res.status(400).end();
    return;
  }

  const user = refreshTokens.get(refreshToken) as User;

  const accessToken = jwt.sign({ user }, JWT_SIGNING_KEY, {
    expiresIn: 5, // 5s
  });

  res.status(200).json({ accessToken });
}
