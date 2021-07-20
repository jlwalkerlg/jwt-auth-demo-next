import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../api";
import { JWT_SIGNING_KEY } from "../../config";
import refreshTokens from "../../data/refresh-tokens";

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
    expiresIn: 5, // 5s
  });

  const cookies = new Cookies(req, res);

  const requestRefreshToken = cookies.get("refresh_token");

  if (requestRefreshToken && refreshTokens.has(requestRefreshToken)) {
    refreshTokens.delete(requestRefreshToken);
  }

  const newRefreshToken = uuidv4();

  cookies.set("refresh_token", newRefreshToken, {
    // expires: new Date(Date.now() + 60 * 60 + 60), // 1hr?
    httpOnly: true,
  });

  refreshTokens.set(newRefreshToken, user);

  res.status(200).json({ accessToken });
}
