// src/hooks/useLions.ts
// 아기사자 명단을 Supabase에 영구 저장하기 위한 데이터 훅.
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Lion, Contact } from '../data/lion';

// Supabase 테이블은 snake_case, 앱은 camelCase 라서 변환이 필요함.
interface LionRow {
  id: number;
  name: string;
  part: string;
  part_key: string | null;
  track: string | null;
  quote: string | null;
  intro: string | null;
  full_introduction: string | null;
  contact: Contact | null;
  skills: string[] | null;
  determination: string | null;
  image: string | null;
  is_me: boolean | null;
}

// DB row(snake_case) -> 앱의 Lion(camelCase)
function rowToLion(row: LionRow): Lion {
  return {
    id: row.id,
    name: row.name,
    part: row.part,
    partKey: row.part_key ?? undefined,
    track: row.track ?? undefined,
    quote: row.quote ?? undefined,
    intro: row.intro ?? undefined,
    fullIntroduction: row.full_introduction ?? undefined,
    contact: row.contact ?? {},
    skills: row.skills ?? [],
    determination: row.determination ?? undefined,
    image: row.image ?? null,
    isMe: row.is_me ?? false,
  };
}

// 앱의 Lion(id 제외) -> DB insert payload(snake_case)
function lionToInsertRow(lion: Omit<Lion, 'id'>) {
  return {
    name: lion.name,
    part: lion.part,
    part_key: lion.partKey ?? null,
    track: lion.track ?? null,
    quote: lion.quote ?? null,
    intro: lion.intro ?? null,
    full_introduction: lion.fullIntroduction ?? null,
    contact: lion.contact ?? {},
    skills: lion.skills ?? [],
    determination: lion.determination ?? lion.determin ?? null,
    image: lion.image ?? null,
    is_me: lion.isMe ?? false,
  };
}

interface UseLionsReturn {
  lions: Lion[];
  loading: boolean;
  error: string | null;
  addLions: (newLions: Omit<Lion, 'id'>[]) => Promise<void>;
  deleteLast: () => Promise<void>;
  refreshRandom: (newLions: Omit<Lion, 'id'>[]) => Promise<void>;
  reload: () => Promise<void>;
}

export function useLions(): UseLionsReturn {
  const [lions, setLions] = useState<Lion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 전체 목록을 DB에서 다시 읽어온다 (단일 진실 공급원).
  const reload = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('lions')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLions(((data ?? []) as LionRow[]).map(rowToLion));
    setLoading(false);
  }, []);

  // 첫 렌더 시 목록 로드
  useEffect(() => {
    reload();
  }, [reload]);

  // 여러 명 추가 (수동 1명 / 랜덤 N명 공통). 실패 시 throw -> 호출부에서 catch.
  const addLions = async (newLions: Omit<Lion, 'id'>[]): Promise<void> => {
    if (newLions.length === 0) return;
    const { error } = await supabase
      .from('lions')
      .insert(newLions.map(lionToInsertRow));
    if (error) throw new Error(error.message);
    await reload();
  };

  // 마지막에 추가된 한 명 삭제
  const deleteLast = async (): Promise<void> => {
    if (lions.length === 0) return;
    const last = lions[lions.length - 1];
    const { error } = await supabase.from('lions').delete().eq('id', last.id);
    if (error) throw new Error(error.message);
    await reload();
  };

  // 내 카드(is_me)는 남기고 나머지를 새 랜덤 명단으로 교체
  const refreshRandom = async (newLions: Omit<Lion, 'id'>[]): Promise<void> => {
    const { error: delError } = await supabase
      .from('lions')
      .delete()
      .eq('is_me', false);
    if (delError) throw new Error(delError.message);

    if (newLions.length > 0) {
      const { error: insError } = await supabase
        .from('lions')
        .insert(newLions.map(lionToInsertRow));
      if (insError) throw new Error(insError.message);
    }
    await reload();
  };

  return { lions, loading, error, addLions, deleteLast, refreshRandom, reload };
}
