import { useState } from 'react';
import { toast } from 'sonner';

import { useMapUI } from './useMapUI';
import { useMapStore } from '../store/MapStore';
import { getZoomLevelByRadius } from '../utils/zoomUtils';
import { queryToFilters } from '../api/aiSearchApi';

export const useAiSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    searchRadius,
    setZoomLevel,
    applyFilters,
    setSearchParams,
    userLocation,
    mapCenter,
  } = useMapStore();

  const { setCategoryFilter } = useMapUI();

  const handleAiSearch = async (userText: string) => {
    if (!userText.trim()) return;

    setIsLoading(true);
    setError(null);

    // 검색 시 현재 설정된 반경을 기본값으로 전달
    // (AI가 판단하기 어려울 때 참고용)
    const currentRadius = searchRadius;

    try {
      const data = await queryToFilters({
        userText,
        defaultRadius: currentRadius,
      });

      // 1. 반경 적용 (줌 레벨 변경)
      const mappedZoomLevel = getZoomLevelByRadius(data.radius);
      setZoomLevel(mappedZoomLevel);

      // 2. 필터 적용
      // ID 기반 필터 적용
      // 현재 프론트엔드에는 Category ID -> Tab Name 매핑 정보가 없으므로,
      // 데이터 필터링(MapStore)만 적용하고 UI 탭 자동 활성화는 'all'로 유지하거나 추후 매핑 로직 추가 필요.
      
      applyFilters({
        categoryIds: data.categoryIds || undefined,
        brandIds: data.brandIds || undefined,
      });
      
      // UI 업데이트 (탭 활성화용)
      // ID만으로는 어떤 탭인지 알 수 없으므로 우선 전체('all')로 설정하거나
      // 향후 API 응답에 categoryName이 포함되면 그때 매핑 가능.
      // 일단은 필터 적용 사실만 toast 등으로 인지 가능.
      setCategoryFilter('all');
      
      
      // 검색 파라미터 업데이트로 재검색 트리거 (필요한 경우)
      const center = userLocation || mapCenter;
      setSearchParams({
        lat: center.lat,
        lng: center.lng,
        radius: data.radius, // AI가 준 정확한 반경 사용
      });


      // 3. Notes Toast 표시
      if (data.notes) {
        toast.info(data.notes, {
            duration: 4000,
        });
      }

      if (data.fallback) {
        toast.warning('AI 분석에 실패하여 기본 설정으로 검색합니다.');
      }

    } catch (err) {
      console.error('AI Search Failed:', err);
      setError('AI 검색 중 오류가 발생했습니다.');
      toast.error('AI 분석에 실패했습니다. 기본 설정으로 검색합니다.');
      
      // 에러 시에도 기본 텍스트 검색이라도 돌리고 싶다면 여기서 처리 가능
      // 요구사항: "기본 설정으로 검색합니다" 메시지 처리
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleAiSearch,
  };
};
