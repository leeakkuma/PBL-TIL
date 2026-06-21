import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import { useLions } from './hooks/useLions';

function App() {
  // 명단 데이터는 Supabase에 영구 저장되며, 이 훅이 로드/추가/삭제를 담당한다.
  const { lions, loading, error, addLions, deleteLast, refreshRandom } = useLions();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ListPage
              lions={lions}
              loading={loading}
              error={error}
              addLions={addLions}
              deleteLast={deleteLast}
              refreshRandom={refreshRandom}
            />
          }
        />
        <Route path="/lions/:id" element={<DetailPage lions={lions} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
