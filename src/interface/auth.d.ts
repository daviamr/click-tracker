export type CreateNewUser = {
    name: string;
    password: string;
    email: string;
  };

  export type EditNewUser = {
    id: string;
    name: string;
    password: string;
    email: string;
  };

  export type deleteUser = {
    id: string;
  }

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
    image?: File;
    name: string;
  }

  export type customerData = {
    id: string;
    image: File;
    name: string;
    logo?: string;
    totalCampaigns: number;
    totalActions: number;
    totalClicks: number;
    totalLinks: number;
    totalLps: number;
  }

  export type deleteCustomer = {
    id: string
  }

  export type createNewCampaign = {
    name: string;
    clientId: string;
    category: string;
    subcategory: string;
    payout: number;
    model: string;
    type: string;
    startAt?: string;
    endAt?: string;
    obs: string;
  }

  export type editCampaign = {
    id: number;
    name: string;
    clientId: string;
    category: string;
    subcategory: string;
    payout: number;
    model: string;
    type: string;
    startAt?: string;
    endAt?: string;
    obs: string;
  }

  export type deleteCampaign = {
    id: number;
  }

  export type campaignData = {
    id: number,
    name: string;
    obs: string;
    status: string;
    startAt: string;
    endAt: string;
    category: string;
    subCategory: string;
    model: string;
    type: string;
    payout: number;
    clientId: string;
    totalActions: number;
    totalClicks: number;
    totalLinks: number;
  }

  export type statusCampaign = {
    id: number;
  }

  export type createNewAction = {
    name: string;
    campaignId: number;
    startAt: string;
    endAt: string;
    utm: string;
    cost: string;
    key: string;
    landingPageId: number;
  }

  export type editAction = {
    id: number;
    name: string;
    campaignId: number;
    startAt: string;
    endAt: string;
    utm: string;
    cost: string;
    landingPageId: number;
    key: string;
  }

  export type dataAction = {
    id: number;
    name: string;
    clientName: string;
    campaignName: string;
    landingPageName: string;
    cost: number;
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
    actions: number;
    campaigns: number;
    totalClicks: number;
    totalLinks: number;
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
    baseUrlId?: number;
    alphabetId: number;
    redirectUrl: string;
    replace?: string;
    length: number;
    qrCode: boolean;
  }

  export type createLP = {
    name: string;
    campaignId: number;
    url: string;
  }

  export type editLP = {
    id: number,
    name: string,
    campaignId: number;
    url: string;
  }

  export type lpsData = {
    id: number;
    name: string;
    campaignName: string;
    clientName: string;
    url: string;
    totalActions: number;
    totalClicks: number;
    totalLinks: number;
  }

  export type deleteLp = {
    id: number;
  }

  export type createBase = {
    name: string;
    url: string;
  }

  export type editBase = {
    id: number;
    name: string;
    url: string;
  }

  export type baseProps = {
    id: number;
    name: string;
    url: string;
  }

  export type deleteBase = {
    id: number;
  }

  export type finalURLProps = {
    id: number;
    name: string;
    url: string;
    campaignId: number;
    campaign: {client: {name: string}}
  }

  export type createFinalURL = {
    name: string;
    url: string;
    campaignId: number;
  }

  export interface ApiResponse {
    qrCode: string;
    redirectUrl: string;
    shortUrl: string;
  }