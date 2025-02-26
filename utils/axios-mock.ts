import axios, { AxiosError } from "axios";

const createInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,
  });

  instance.interceptors.response.use(
    (config) => {
      return config;
    },
    (error) => {
      if (error.response?.data.message) {
        return Promise.reject({
          ...error,
          response: {
            ...error.response,
            data: {
              ...error.response.data,
              message:
                typeof error.response.data.message === "string"
                  ? error.response.data.message
                  : "Erro inesperado",
            },
          },
        });
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export const apiMock = createInstance(process.env.NEXT_PUBLIC_API_URL ?? "");

interface QueryKey {
  queryKey: [string];
}

export const mockQuery = async (res: QueryKey): Promise<any> => {
  const [url] = res.queryKey;
  try {
    const { data } = await apiMock.get(url);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

const handleError = (error: unknown): Promise<never> => {
  if (error instanceof AxiosError) {
    return Promise.reject(error.response?.data || error.message);
  }
  return Promise.reject(error);
};

export const mockMutation = async (
  url: string,
  data: any,
  type: 'get' | 'post' | 'put' | 'delete' | 'patch'
): Promise<any> => {
  try {
    const { data: responseData } = await apiMock[type](url, data);
    return responseData;
  } catch (error) {
    return handleError(error);
  }
};