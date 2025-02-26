import { buildUrl } from "@/utils/helpers/helper";
import { useMutation, useQuery, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { mockMutation, mockQuery } from "@/utils/axios-mock";
import { buildPaginatedTableURL } from "@/utils/table-paginated";
import { toaster } from "@/components/ui/toaster";

interface MutationGenerateReportProps {
  onError: (error: unknown) => void;
  onSuccess: (data: any) => void;
}

export const FetchReportsAllQuery = (
  query: Record<string, any>
): UseQueryResult<any, Error> => {
  const url = buildUrl({
    baseUrl: "reports",
    query,
  })

  const resQuery = useQuery({
    queryKey: [url],
    queryFn: mockQuery,
  });

  if (resQuery.isError) {
    toaster.error(resQuery.error.message);
  }

  return resQuery;
};

export const MutationGenerateReport = ({
  onError,
  onSuccess,
}: MutationGenerateReportProps): UseMutationResult<any, Error, any> => {
  const url = `/reports/generate`;

  const mutationFn = async (data: any) => {
    return await mockMutation(url, data, "post" );
  };

  const resMutation = useMutation({
    mutationKey: [url],
    mutationFn: mutationFn,
    onError,
    onSuccess,
  }) as UseMutationResult;

  return resMutation;
};


export const MutationValidateCustomer = ({
  onError,
  onSuccess,
}: MutationGenerateReportProps): UseMutationResult<any, Error, any> => {
  const url = `/reports/validate-customer`;

  const mutationFn = async (data: any) => {
    return await mockMutation(url, data, "post" );
  };

  const resMutation = useMutation({
    mutationKey: [url],
    mutationFn: mutationFn,
    onError,
    onSuccess,
  }) as UseMutationResult;

  return resMutation;
};
