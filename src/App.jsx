import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import CustomCursor from '@/ui/CustomCursor';
import Preloader from '@/ui/Preloader';

const Home = lazy(() => import('@/pages/Home'));
const Detector = lazy(() => import('@/pages/Detector'));

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}
      <BrowserRouter>
        <CustomCursor>
          <MainLayout>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detector" element={<Detector />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </CustomCursor>
      </BrowserRouter>
    </>
  );
}

export default App;