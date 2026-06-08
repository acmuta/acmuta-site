export interface Sponsor {
  id: string;
  name: string;
  /** Logo URL; empty string = use text name only */
  logo: string;
  /** Display tier label */
  tier: string;
  url: string;
}

export const sponsorsData: Sponsor[] = [
  { id: "lockheed",  name: "Lockheed Martin",   logo: "/assets/companies/lockheed.png",  tier: "Platinum", url: "https://lockheedmartin.com" },
  { id: "paycom",    name: "Paycom",             logo: "/assets/companies/paycom.png",    tier: "Platinum", url: "https://paycom.com" },
  { id: "microsoft", name: "Microsoft",          logo: "/assets/companies/microsoft.png", tier: "Gold",     url: "https://microsoft.com" },
  { id: "google",    name: "Google",             logo: "",                                tier: "Gold",     url: "https://google.com" },
  { id: "amazon",    name: "Amazon",             logo: "",                                tier: "Gold",     url: "https://amazon.com" },
  { id: "ti",        name: "Texas Instruments",  logo: "",                                tier: "Silver",   url: "https://ti.com" },
  { id: "capone",    name: "Capital One",        logo: "",                                tier: "Silver",   url: "https://capitalone.com" },
  { id: "jobright",  name: "Jobright",           logo: "/assets/companies/jobright.svg",  tier: "Silver",   url: "https://jobright.ai" },
];

// Legacy compat export — removed when pages are rewritten in Stage D/E.
export const sponsors = sponsorsData;
