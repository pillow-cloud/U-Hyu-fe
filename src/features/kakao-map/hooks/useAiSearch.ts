import { useState } from 'react';
import { toast } from 'sonner';

import { useMapUI } from './useMapUI';
import { useMapStore } from '../store/MapStore';
import { getZoomLevelByRadius } from '../utils/zoomUtils';
import { queryToFilters } from '../api/aiSearchApi';
import { getFilterCategoryForStore } from '../config/categoryMapping';

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
      // 카테고리 정합성 체크 및 매핑 (AI가 '카페'로 주면 '베이커리/디저트'로 변환 등)
      let finalCategory = data.category;
      if (finalCategory) {
          const mapped = getFilterCategoryForStore(finalCategory);
          // 매핑 결과가 'all'이고 원본이 'all'이 아니었다면, 매핑 실패로 간주할 수도 있으나
          // getFilterCategoryForStore는 매핑 실패 시 'all'을 반환하므로 안전하게 'all' 사용
          finalCategory = mapped;
      }

      // MapStore 업데이트 (데이터 필터링용)
      applyFilters({
        category: finalCategory || undefined,
        brand: data.brand || undefined,
      });
      
      // UI 업데이트 (탭 활성화용)
      // 정규화된 카테고리를 설정하여 UI 탭이 정확히 활성화되도록 함
      if (finalCategory && finalCategory !== 'all') {
          setCategoryFilter(finalCategory);
      } else {
          setCategoryFilter('all'); 
      }
      
      
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
