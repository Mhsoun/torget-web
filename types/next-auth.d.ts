import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    tokenExpiresAt?: string;
    authError?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    tokenExpiresAt?: string;
    authError?: string;
  }
}
