import { XMarkIcon } from '@heroicons/react/20/solid';
import { useMapStore } from '../../store/MapStore';
import { FILTER_TABS } from '@/shared/components/filter_tabs/FilterTabs.variants';

export const AiFilterStatus: React.FC = () => {
  const currentFilters = useMapStore((state) => state.currentFilters);
  const searchRadius = useMapStore((state) => state.searchRadius);
  const stores = useMapStore((state) => state.stores);
  const applyFilters = useMapStore((state) => state.applyFilters);

  // 기본 반경(20km, zoomLevel 8~9?)이 아닐 때만 보여줄 수도 있지만, 
  // 사용자가 "반경 정보"를 확인하고 싶어하므로 항상 보여주거나, AI 검색 직후 보여주는 것이 좋음.
  // 여기선 일단 반경은 항상 표시하거나, AI 검색 흐름을 탔을 때 표시하는 플래그가 없으므로
  // 필터가 하나라도 있으면 반경도 같이 보여주는 식으로 처리.
  
  const hasActiveFilters = 
    currentFilters.brand || 
    currentFilters.category ||
    (Array.isArray(currentFilters.brandIds) && currentFilters.brandIds.length > 0) ||
    (Array.isArray(currentFilters.categoryIds) && currentFilters.categoryIds.length > 0);

  if (!hasActiveFilters) return null;

  // Safe Access Helper
  const safeBrandIds = Array.isArray(currentFilters.brandIds) ? currentFilters.brandIds : [];
  const safeCategoryIds = Array.isArray(currentFilters.categoryIds) ? currentFilters.categoryIds : [];

  const handleRemoveBrand = () => {
    applyFilters({ ...currentFilters, brand: undefined, brandIds: undefined });
  };

  const handleRemoveCategory = () => {
    applyFilters({ ...currentFilters, category: undefined, categoryIds: undefined });
  };
  
  // ID 기반 필터의 경우 이름을 알 수 없으므로, 현재 로드된 매장 리스트에서 메타데이터를 추출
  // (주의: 매장이 하나도 검색되지 않으면 이름을 알 수 없는 한계가 있음 -> 이 경우 '브랜드' 등으로 표시)
  
  const getBrandMetadata = () => {
    if (safeBrandIds.length === 0) return null;
    if (!stores) return null;
    
    // 현재 필터링된 브랜드 ID와 일치하는 매장을 찾음
    const matchedStore = stores.find(store => 
      store && store.brandId && safeBrandIds.includes(store.brandId)
    );

    if (matchedStore) {
      const remainingCount = safeBrandIds.length - 1;
      return {
        name: remainingCount > 0 
          ? `${matchedStore.brandName || '브랜드'} 외 ${remainingCount}개` 
          : (matchedStore.brandName || '브랜드'),
        image: matchedStore.logoImage // undefined is handled by render check
      };
    }
    
    return null;
  };
  
  const getCategoryMetadata = () => {
     if (safeCategoryIds.length === 0) return null;
     if (!stores) return null;

     // 카테고리는 매장 데이터에서 categoryName을 가져옴
     const matchedStore = stores.find(store => store.categoryName); 
     
     if (matchedStore) {
        return matchedStore.categoryName;
     }

     return null;
  };

  const brandInfo = getBrandMetadata();
  const brandLabel = brandInfo 
    ? brandInfo.name
    : currentFilters.brand 
      ? currentFilters.brand 
      : (safeBrandIds.length > 0) 
        ? `브랜드 ${safeBrandIds.length}개` 
        : null;

  const categoryInfo = getCategoryMetadata();
  const categoryLabel = categoryInfo
    ? categoryInfo
    : currentFilters.category 
      ? currentFilters.category 
      : (safeCategoryIds.length > 0) 
        ? `카테고리 ${safeCategoryIds.length}개` 
        : null;
        
  // 카테고리 색상 찾기
  const categoryColor = categoryInfo && FILTER_TABS
    ? FILTER_TABS.find(tab => tab.value === categoryInfo)?.color 
    : null;
    
  // 기본 보라색(Purple) or 카테고리별 색상
  const categoryStyle = categoryColor 
    ? {
        backgroundColor: `${categoryColor}33`, // 20% opacity (increased from ~8%)
        borderColor: `${categoryColor}66`,     // 40% opacity
        color: categoryColor,
      }
    : {
        backgroundColor: '#f3e8ff', // bg-purple-100 (more visible than 50)
        borderColor: '#d8b4fe',     // border-purple-300
        color: '#7e22ce',           // text-purple-700
      };

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/5 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
        <span className="text-xs font-medium text-gray-600">
           반경 {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
        </span>
      </div>

      {brandLabel && (
        <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-white rounded-full border border-brand-blue/30 shadow-sm">
          {brandInfo?.image ? (
            <img 
              src={brandInfo.image} 
              alt={brandLabel} 
              className="w-5 h-5 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-[10px] font-bold">
              B
            </div>
          )}
          <span className="text-xs font-semibold text-gray-800">
            {brandLabel}
          </span>
          <button 
            onClick={handleRemoveBrand}
            className="ml-0.5 p-0.5 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {categoryLabel && (
        <div 
            className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full border shadow-sm transition-colors"
            style={{
                backgroundColor: categoryStyle.backgroundColor,
                borderColor: categoryStyle.borderColor,
            }}
        >
          <span 
            className="text-xs font-semibold"
            style={{ color: categoryStyle.color }}
          >
            {categoryLabel}
          </span>
          <button 
            onClick={handleRemoveCategory}
            className="p-0.5 rounded-full hover:bg-black/5"
            style={{ color: categoryStyle.color }}
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
