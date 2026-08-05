"use client";

import { useEffect, useState } from "react";

/** Возвращает true после первого рендера на клиенте — помогает избежать
 * несовпадения гидратации при чтении persisted-состояния (localStorage). */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-mount flag, no non-effect equivalent
  useEffect(() => setMounted(true), []);
  return mounted;
}
