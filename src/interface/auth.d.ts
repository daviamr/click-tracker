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
    jwtToken: string
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

  export type editCustomer = {
    id: string;
    image: File;
    name: string;
  }

  export type customerData = {
    id: string;
    image: File;
    name: string;
    logo?: string;
  }

  export type deleteCustomer = {
    id: string
  }

  export type createNewCampaign = {
    name: string;
    clientId: string;
  }

  export type editCampaign = {
    id: number;
    name: string;
    clientId: string;
  }

  export type deleteCampaign = {
    id: number;
  }

  export type campaignData = {
    id: number,
    name: string;
    clientId: string;
    Client: {name: string};
    startAt: string;
    endAt: string;
  }

  export type createNewAction = {
    name: string;
    campaignId: number;
    customPath: string;
    startAt: string;
    endAt: string;
  }

  export type editAction = {
    id: number;
    name: string;
    campaignId: number;
    startAt: string;
    endAt: string;
    customPath: string;
  }

  export type dataAction = {
    id: number;
    name: string;
    Campaign: {
      Client: {
        name: string;
      }
      name: string;
    }
    startAt: string;
    endAt: string;
    status: string;
  }

  export type statusAction = {
    id: number;
  }

  export type deleteAction = {
    id: number;
  }

  export type createNewURL = {
    url: string;
  }

  export type editURL = {
    id: number;
    url: string;
  }

  export type urlData = {
    id: number;
    url: string;
  }

  export type deleteURL = {
    id: number;
  }

  export type createNewConversor = {
    name: string;
    characters: string;
  }
  
  export type conversorData = {
    id: number;
    name: string;
    characters: string;
  }

  export type editConversor = {
    id: number;
    name: string;
    characters: string;
  }

  export type deleteConversor = {
    id: number;
  }

  export type selectShortUrl = {
    url: string;
  }

  export type encurtadorData = {
    actionId: number;
    baseUrlId: number;
    alphabetId: number;
    length: number;
    sheet: File;
    longUrl: string;
    replace: string;
  }