export interface CheckoutUser {
  taxId?: string;
  company?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  postCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
}
