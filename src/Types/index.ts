// Define a type for our user
export type User = {
  _id?: string;
  uid: string;
  email: string | null;
  username: string | null;
  config?: { headers: { Authorization: string } };
  listings: Listing[];
  avatar?: GenericObject | null;
};

export type Listing = {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GenericObject = {
  [key: string]: any;
};
