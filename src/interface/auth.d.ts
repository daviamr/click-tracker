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
    _count: {
      campaigns: number;
    }
    totalActions: number;
    totalClicks: number;
    totalLinks: number;
  }

  export type deleteCustomer = {
    id: string
  }

  export type createNewCampaign = {
    name: string;
    clientId: string;
    startAt?: string;
    endAt?: string;
  }

  export type editCampaign = {
    id: number;
    name: string;
    clientId: string;
    startAt: string;
    endAt: string;
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
    totalClicks: number;
    totalLinks: number;
    status: string;
    _count: {actions: number};
  }

  export type statusCampaign = {
    id: number;
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
    campaign: {
      client: {
        name: string;
      }
      name: string;
    }
    customPath: string;
    startAt: string;
    endAt: string;
    status: string;
    totalClicks: number;
    totalLinks: number;
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

  export type createNewLink = {
    actionId: number;
    baseUrlId: number;
    alphabetId: number;
    redirectUrl: string;
    replace?: string;
    sheet?: File;
    length: number;
    qrCode: boolean;
  }

  export type createNewSingleLink = {
    actionId: number;
    baseUrlId: number;
    alphabetId: number;
    redirectUrl: string;
    length: number;
    qrCode: boolean;
  }

  export type createNewSingleLinkOptionThree = {
    actionId: number;
    baseUrlId: number;
    alphabetId: number;
    redirectUrl: string;
    replace?: string;
    length: number;
    qrCode: boolean;
  }

  export interface ApiResponse {
    qrCode: string;
    redirectUrl: string;
    shortUrl: string;
  }