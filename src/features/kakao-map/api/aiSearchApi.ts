import { client } from '@/shared/client/axiosClient';
import type { ApiResponse } from '@/shared/client/client.type';

export interface AiSearchResponseData {
  radius: number;
  category: string | null;
  brand: string | null;
  notes: string;
  fallback: boolean;
}

export interface AiSearchRequest {
  userText: string;
  defaultRadius: number;
}

export type AiSearchResponse = ApiResponse<AiSearchResponseData>;

export const queryToFilters = async (
  request: AiSearchRequest
): Promise<AiSearchResponseData> => {
  const response = await client.post<AiSearchResponse>(
    '/api/ai/query-to-filters',
    request
  );

  if (!response.data?.data) {
    throw new Error('AI Search response data is missing');
  }

  return response.data.data;
};
