import { client } from '@/shared/client/axiosClient';
import type { ApiResponse } from '@/shared/client/client.type';

export interface AiSearchResponseData {
  radius: number;
  brandIds: number[];
  categoryIds: number[];
  unrecognizedFilters: string[];
  notes: string;
  confidence: number;
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
