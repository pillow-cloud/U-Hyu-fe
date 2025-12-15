import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import type { NormalizedPlace } from '../api/types';
import { useMapUI } from '../hooks/useMapUI';
import MapTopControls from './layout/MapTopControls';

interface MapControlsContainerProps {
  onKeywordSearchResults?: (results: NormalizedPlace[]) => void;
  keywordResults?: NormalizedPlace[];
  onClearMarkers?: () => void;
  onCloseSearchResults?: () => void;
  mapCenterSetter?: ((center: { lat: number; lng: number }) => void) | null;
  onPlaceClick?: (place: NormalizedPlace) => void;
  /** 자동 실시간 검색 활성화 여부 */
  enableAutoSearch?: boolean;
  /** 디바운스 지연 시간 (밀리초) */
  debounceDelay?: number;
  /** 현재 지도 중심 좌표 */
  mapCenter?: { lat: number; lng: number };
  /** 검색 결과를 유지한 채로 아이템 선택 (검색창은 닫지 않음) */
  onSearchResultItemClick?: (place: NormalizedPlace) => void;
  /** 지도 인스턴스 (줌 레벨 표시용) */
  map?: kakao.maps.Map | null;
}

/**
 * 지도 상단 컨트롤 컨테이너 컴포넌트
 * 검색, 필터 등 지도 상단의 모든 UI 컨트롤을 관리
 */
export const MapControlsContainer: React.FC<MapControlsContainerProps> = ({
  map,
}) => {
  const {
    activeRegionFilter,
    setRegionFilter,
    setCategoryFilter,
    activeCategoryFilter,
  } = useMapUI();

  // Legacy search logic Removed - using NaturalSearchInput with useAiSearch internal hook.
  // We keep the props interface of MapControlsContainer for compatibility with MapPage, but they might be unused.
  

  // Handler for analytics or additional side effects if needed when search is triggered
  const handleSearch = () => {
    // console.log('Search triggered:', value);
  };

  const handleRegionFilterChange = (region: string) => {
    setRegionFilter(region);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
  };
  const { uuid } = useParams();
  const isShared = !!uuid;

  return isShared ? null : (
    <div>
      <MapTopControls
        onSearch={handleSearch}
        activeRegionFilter={activeRegionFilter}
        onRegionFilterChange={handleRegionFilterChange}
        activeCategoryFilter={activeCategoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        map={map}
      />
    </div>
  );
};
