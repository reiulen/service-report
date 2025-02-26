
interface BuildUrlState {
    baseUrl: string;
    query: Record<string, any>;
}

export const buildUrl = ({ baseUrl, query }: BuildUrlState): string => {
    const queryString = new URLSearchParams(query).toString();
  
    return `${baseUrl}?${queryString}`;
};