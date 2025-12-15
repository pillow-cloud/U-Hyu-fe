import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useMapStore } from '../../store/MapStore';

export const AiFilterStatus: React.FC = () => {
  const currentFilters = useMapStore((state) => state.currentFilters);
  const searchRadius = useMapStore((state) => state.searchRadius);
  const applyFilters = useMapStore((state) => state.applyFilters);

  // 기본 반경(20km, zoomLevel 8~9?)이 아닐 때만 보여줄 수도 있지만, 
  // 사용자가 "반경 정보"를 확인하고 싶어하므로 항상 보여주거나, AI 검색 직후 보여주는 것이 좋음.
  // 여기선 일단 반경은 항상 표시하거나, AI 검색 흐름을 탔을 때 표시하는 플래그가 없으므로
  // 필터가 하나라도 있으면 반경도 같이 보여주는 식으로 처리.
  
  const hasActiveFilters = currentFilters.brand || currentFilters.category;

  if (!hasActiveFilters) return null;

  const handleRemoveBrand = () => {
    applyFilters({ ...currentFilters, brand: undefined });
  };

  const handleRemoveCategory = () => {
    applyFilters({ ...currentFilters, category: undefined });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/5 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
        <span className="text-xs font-medium text-gray-600">
           반경 {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
        </span>
      </div>

      {currentFilters.brand && (
        <div className="flex items-center gap-1 pl-3 pr-2 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
          <span className="text-xs font-semibold text-brand-blue">
            {currentFilters.brand}
          </span>
          <button 
            onClick={handleRemoveBrand}
            className="p-0.5 rounded-full hover:bg-brand-blue/20 text-brand-blue"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {currentFilters.category && (
        <div className="flex items-center gap-1 pl-3 pr-2 py-1 bg-purple-50 rounded-full border border-purple-100">
          <span className="text-xs font-semibold text-purple-600">
            {currentFilters.category}
          </span>
          <button 
            onClick={handleRemoveCategory}
            className="p-0.5 rounded-full hover:bg-purple-100 text-purple-600"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
