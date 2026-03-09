import { CheckoutUserBuilder } from './builders/CheckoutUserBuilder';

export function defaultCheckoutUser() {
  return new CheckoutUserBuilder().build();
}
