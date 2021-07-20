import Cookies from "cookies";
import type { NextApiRequest, NextApiResponse } from "next";
import refreshTokens from "../../data/refresh-tokens";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);

  const requestRefreshToken = cookies.get("refresh_token");

  if (requestRefreshToken) {
    cookies.set("refresh_token");

    if (refreshTokens.has(requestRefreshToken)) {
      refreshTokens.delete(requestRefreshToken);
    }
  }

  res.status(200).end();
}
