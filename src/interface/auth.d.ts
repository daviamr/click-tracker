export type CreateNewUser = {
    name: string;
    password: string;
    email: string;
  };

  export type Login = {
    email: string;
    password: string;
  };

  export type DataProps = {
    data: {jwtToken: string}
  }

  export type userDataProps = {
    id: string; 
    email: string; 
    name: string; 
    createdAt: string
  }

  export type createNewCustomer = {
    image: File;
    name: string;
  }

  export type customerData = {
    image: File;
    name: string;
    logo?: string;
  }