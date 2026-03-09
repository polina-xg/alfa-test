import { Env } from 'playwright/types/EnvTypes';
import rawEnv from '@env/env.json';
const env = rawEnv as Env;
import { User } from '../../types/User';

export default class UserBuilder {
  private user: Partial<User> = {};

  fromEnv(): this {
    const email = env.currentUser;
    const envUser = env.users[email];

    this.user.email = email;
    this.user.password = envUser.password;
    this.user.name = envUser.name;
    this.user.surname = envUser.surname;

    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  build(): User {
    return this.user as User;
  }
}
