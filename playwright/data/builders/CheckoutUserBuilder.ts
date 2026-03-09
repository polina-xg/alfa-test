import { CheckoutUser } from '../../types/CheckOutTypes';
import { Env } from 'playwright/types/EnvTypes';
import rawEnv from '@env/env.json';
const env = rawEnv as Env;

export class CheckoutUserBuilder {
  private user: CheckoutUser = {
    taxId: '',
    company: '',
    firstName: 'Anna',
    lastName: 'Ivanova',
    address1: 'Street 1',
    address2: '',
    postCode: '12345',
    city: 'Minsk',
    country: 'Belarus',
    email: env.currentUser,
    phone: '+375291112233',
  };

  withFirstName(firstName: string) {
    this.user.firstName = firstName;
    return this;
  }

  withLastName(lastName: string) {
    this.user.lastName = lastName;
    return this;
  }

  withCountry(country: string) {
    this.user.country = country;
    return this;
  }

  withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  withPhone(phone: string) {
    this.user.phone = phone;
    return this;
  }

  build(): CheckoutUser {
    return this.user;
  }
}
