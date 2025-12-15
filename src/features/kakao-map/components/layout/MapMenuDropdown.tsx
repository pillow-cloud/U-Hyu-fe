import React from 'react';
import { 
    MapPinIcon, 
} from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon, BookmarkSquareIcon, MapIcon } from '@heroicons/react/24/outline';
import { BookmarkSquareIcon as BookmarkSolid } from '@heroicons/react/24/solid';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from '@/shared/components/shadcn/ui/dropdown-menu';
import { Button } from '@/shared/components/shadcn/ui/button';
import { REGIONS, getRegionInfo } from '../../constants/regions';
import { useMapData } from '../../hooks/useMapData';
import { useIsLoggedIn } from '@user/store/userStore';
import { useModalStore } from '@/shared/store';

interface MapMenuDropdownProps {
  activeRegionFilter: string;
  onRegionFilterChange: (value: string) => void;
}

export const MapMenuDropdown: React.FC<MapMenuDropdownProps> = ({
  activeRegionFilter,
  onRegionFilterChange,
}) => {
  // Location Logic
  const { getCurrentLocation, loading } = useMapData();
  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    getCurrentLocation(true);
  };

  // Bookmark Logic
  const { isBookmarkMode, toggleBookmarkMode } = useMapData();
  const isLoggedIn = useIsLoggedIn();
  const openModal = useModalStore(state => state.openModal);

  const handleBookmarkToggle = (checked: boolean) => {
    if (!isLoggedIn && checked) {
        // If trying to turn on but not logged in
        openModal('login');
        return;
    }
    toggleBookmarkMode();
  };

  // Region Info
  const currentRegionLabel = getRegionInfo(activeRegionFilter)?.label || '지역';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="outline" 
            size="icon"
            className="w-10 h-10 bg-white border-none shadow-md hover:bg-brand-blue/5 focus:ring-brand-blue focus:ring-offset-0 rounded-lg transition-colors"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 group-hover:text-brand-blue" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-white border-none shadow-lg z-50 animate-in fade-in-0 zoom-in-95" align="end" sideOffset={5}>
        <DropdownMenuLabel className="text-gray-900">내 지도 설정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
            <DropdownMenuItem 
                onClick={handleLocationClick}
                disabled={loading.location}
                className="cursor-pointer focus:bg-brand-blue/5 focus:text-brand-blue"
            >
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>내 위치로 이동</span>
                {loading.location && <span className="ml-2 text-xs text-brand-blue">(이동중...)</span>}
            </DropdownMenuItem>

            <DropdownMenuCheckboxItem
                checked={isBookmarkMode}
                onCheckedChange={handleBookmarkToggle}
                className="cursor-pointer focus:bg-brand-blue/5 focus:text-brand-blue data-[state=checked]:text-brand-blue"
            >   
                <div className="flex items-center w-full">
                    {isBookmarkMode ? (
                        <BookmarkSolid className="w-4 h-4 mr-2 text-brand-blue" />
                    ) : (
                        <BookmarkSquareIcon className="w-4 h-4 mr-2" />
                    )}
                    <span>즐겨찾기만 보기</span>
                </div>
            </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer focus:bg-brand-blue/5 focus:text-brand-blue data-[state=open]:bg-brand-blue/5 data-[state=open]:text-brand-blue">
                    <MapIcon className="w-4 h-4 mr-2" />
                    <span>지역 이동</span>
                    <span className="ml-auto text-xs opacity-60">{currentRegionLabel}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto bg-white border-none shadow-lg z-50">
                    {REGIONS.map((region) => (
                        <DropdownMenuCheckboxItem
                            key={region.key}
                            checked={activeRegionFilter === region.key}
                            onCheckedChange={() => onRegionFilterChange(region.key)}
                            className="cursor-pointer focus:bg-brand-blue/5 focus:text-brand-blue data-[state=checked]:text-brand-blue"
                        >
                            {region.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
