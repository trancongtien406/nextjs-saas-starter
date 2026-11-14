import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";
const ALG = "HS256";

function key() {
  const secret = process.env.AUTH_SECRET ?? "dev-only-secret-change-me-in-production-please";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: number;
  teamId: number;
}

export async function signSession(payload: SessionPayload, days = 7): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: [ALG] });
    if (typeof payload.userId !== "number" || typeof payload.teamId !== "number") return null;
    return { userId: payload.userId, teamId: payload.teamId };
  } catch {
    return null;
  }
}
