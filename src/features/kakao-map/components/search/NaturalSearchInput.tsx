import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAiSearch } from '../../hooks/useAiSearch';

interface NaturalSearchInputProps {
  onSearch?: (value: string) => void;
  className?: string;
}

const PLACEHOLDERS = [
  "원하는 대로 검색해보세요 (스벅 -> 스타벅스)",
  "가까운 스타벅스 찾아줘",
  "500m 내 편의점 보여줘",
  "조용한 카페 추천해줘",
  "주차 가능한 맛집"
];

export const NaturalSearchInput: React.FC<NaturalSearchInputProps> = ({
  onSearch,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const { isLoading, handleAiSearch } = useAiSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Placeholder Rolling Effect
  useEffect(() => {
    if (isFocused) return; // 포커스 중엔 롤링 멈춤

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        handleAiSearch(value.trim());
        onSearch?.(value.trim());
        inputRef.current?.blur();
      }
    }
  };

  const clearInput = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className={`
          relative flex items-center w-full h-[40px] 
          bg-white rounded-full border transition-all duration-300
          ${isFocused ? 'border-brand-blue shadow-lg ring-4 ring-primary-100' : 'border-gray-200 shadow-md hover:shadow-lg'}
        `}
      >
        {/* Magic Icon (AI) */}
        <div className="pl-3 pr-2 flex-shrink-0">
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            ) : (
                <SparklesIcon className={`w-5 h-5 transition-colors duration-300 ${isFocused || value ? 'text-brand-blue' : 'text-gray-400'}`} />
            )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "원하시는 조건(브랜드, 거리 등)을 자유롭게 입력해보세요" : PLACEHOLDERS[placeholderIndex]}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 px-1 truncate"
        />

        {/* Clear / Search Button */}
        <div className="pr-2 flex-shrink-0 flex items-center gap-1">
          {value && (
            <button 
              onClick={clearInput}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <button
             onClick={() => {
                if(value.trim() && !isLoading) {
                    handleAiSearch(value.trim());
                    onSearch?.(value.trim());
                }
             }}
             className={`
                p-1.5 rounded-full transition-colors duration-200
                ${value.trim() ? 'bg-brand-blue text-white shadow-sm hover:bg-primary-700' : 'bg-gray-100 text-gray-400'}
             `}
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Tooltip for first-time users or specific states can go here */}
    </div>
  );
};
