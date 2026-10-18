'use client';

import dynamic from 'next/dynamic';

// WebGL нельзя рендерить на сервере, поэтому грузим только в браузере
const Scene = dynamic(() => import('./Scene').then((m) => m.Scene), {
  ssr: false,
});

export function SceneLoader() {
  return (
    <div className="stage" aria-hidden="true">
      <Scene />
    </div>
  );
}
