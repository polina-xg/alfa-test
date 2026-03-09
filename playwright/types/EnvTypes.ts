export interface Env {
  url: string;
  currentUser: string;
  users: Record<string, { password: string; name: string; surname: string }>;
}
