import { SceneLoader } from '@/components/SceneLoader';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Overlay } from '@/components/Overlay';

export default function Page() {
  return (
    <main>
      <SceneLoader />
      <SmoothScroll />
      <Overlay />
    </main>
  );
}
