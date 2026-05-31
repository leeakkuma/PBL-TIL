// src/hooks/useLionFilters.ts
import { useSearchParams } from 'react-router-dom';

// 반환값 타입 명시 (지침 1번)
interface UseLionFiltersReturn {
  filterPart: string;
  sortOrder: string;
  searchQuery: string;
  updateParams: (key: string, value: string, defaultValue: string) => void;
}

export function useLionFilters(): UseLionFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterPart = searchParams.get('part') || 'all';
  const sortOrder = searchParams.get('sort') || 'latest';
  const searchQuery = searchParams.get('search') || '';

  const updateParams = (key: string, value: string, defaultValue: string): void => {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  return { filterPart, sortOrder, searchQuery, updateParams };
}