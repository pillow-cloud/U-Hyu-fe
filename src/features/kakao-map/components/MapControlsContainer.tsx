import React, { useEffect, useState } from 'react';

import { MapControlsContainer as MapButtonsContainer } from '@kakao-map/components/controls/MapControlsContainer';
import { useParams } from 'react-router-dom';

import type { NormalizedPlace } from '../api/types';
import { useMapUIContext } from '../context/MapUIContext';
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
  onKeywordSearchResults,
  keywordResults = [],
  onClearMarkers,
  onCloseSearchResults,
  mapCenterSetter,
  onPlaceClick,
  enableAutoSearch = true,
  debounceDelay = Number(import.meta.env.VITE_SEARCH_DEBOUNCE_DELAY) || 500,
  mapCenter,
  onSearchResultItemClick,
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
  
  const { bottomSheetRef } = useMapUIContext();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const BOTTOM_SHEET_THRESHOLD = 300;

  useEffect(() => {
    const checkBottomSheetState = () => {
      if (bottomSheetRef?.current) {
        const currentPosition = bottomSheetRef.current.getCurrentPosition();
        const isOpen = currentPosition < BOTTOM_SHEET_THRESHOLD;
        setIsBottomSheetOpen(isOpen);
      }
    };

    checkBottomSheetState();

    const observer = new MutationObserver(() => {
      setTimeout(checkBottomSheetState, 50);
    });

    if (bottomSheetRef?.current) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [bottomSheetRef]);

  // Handler for analytics or additional side effects if needed when search is triggered
  const handleSearch = (value: string) => {
    // console.log('Search triggered:', value);
  };

  const handleRegionFilterChange = (region: string) => {
    setRegionFilter(region);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleToggleBottomSheet = () => {
    if (bottomSheetRef && bottomSheetRef.current) {
      bottomSheetRef.current.toggle();
    }
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
        onToggleBottomSheet={handleToggleBottomSheet}
        isBottomSheetOpen={isBottomSheetOpen}
        map={map}
      />
      <MapButtonsContainer hideWhenSearching={false} />
    </div>
  );
};
