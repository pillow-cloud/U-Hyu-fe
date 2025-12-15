import { type FC, useRef } from 'react';

import RegionFilterDropdown from '@kakao-map/components/layout/RegionFilterDropdown';

import { FilterTabs } from '@/shared/components';

import { MapZoomLevelIndicator } from '../controls/MapZoomLevelIndicator';
import { NaturalSearchInput } from '../search/NaturalSearchInput';
import { AiFilterStatus } from '../search/AiFilterStatus';
import BottomSheetToggleButton from './BottomSheetToggleButton';

/**
 * MapTopControls 컴포넌트의 Props 인터페이스
 */
interface MapTopControlsProps {
  /** 검색 실행 핸들러 (엔터키 입력 시) */
  onSearch: (value: string) => void;
  /** 현재 선택된 지역 필터 */
  activeRegionFilter: string;
  /** 지역 필터 변경 핸들러 */
  onRegionFilterChange: (value: string) => void;
  /** 현재 선택된 카테고리 필터 */
  activeCategoryFilter: string;
  /** 카테고리 필터 변경 핸들러 */
  onCategoryFilterChange: (value: string) => void;
  /** 바텀시트 토글 핸들러 */
  onToggleBottomSheet: () => void;
  /** 바텀시트 열림/닫힘 상태 */
  isBottomSheetOpen: boolean;
  map?: kakao.maps.Map | null;
}

/**
 * 지도 상단 컨트롤 UI 컴포넌트
 * 검색바, 카테고리 필터탭, 지역 필터 드롭다운을 포함
 * 모바일과 데스크탑에서 반응형으로 동작
 */
const MapTopControls: FC<MapTopControlsProps> = ({
  onSearch,
  activeRegionFilter,
  onRegionFilterChange,
  onCategoryFilterChange,
  onToggleBottomSheet,
  isBottomSheetOpen,
  map,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-14 right-4 z-10 space-y-0.5 pointer-events-none"
    >
      <div className="absolute top-0 right-0 z-20 pointer-events-auto">
        <BottomSheetToggleButton
          isOpen={isBottomSheetOpen}
          onToggle={onToggleBottomSheet}
        />
      </div>

      <div className="flex items-stretch gap-1 ml-0 mr-[40px] pointer-events-auto relative">
        <div className="flex-1 h-[36px]">
          <NaturalSearchInput
            onSearch={onSearch}
            className="z-10"
          />
        </div>

        <div className="flex-shrink-0 h-[36px]">
          <RegionFilterDropdown
            value={activeRegionFilter}
            onChange={onRegionFilterChange}
          />
        </div>
      </div>

      <div className="-ml-14 -mr-4 overflow-x-auto pointer-events-auto">
        <FilterTabs variant="white" onChange={onCategoryFilterChange} />
      </div>

      {/* AI Filter Status Display */}
      <div className="relative pointer-events-auto -ml-14 -mr-4 mt-2">
         <AiFilterStatus />
      </div>

      <div className="flex justify-start pointer-events-none -ml-14 pl-4 mt-2">
        <MapZoomLevelIndicator map={map ?? null} />
      </div>
    </div>
  );
};

export default MapTopControls;
