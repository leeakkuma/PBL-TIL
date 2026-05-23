import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initialLions } from './data/lion';
import ListPage from './ListPage';
import DetailPage from './DetailPage';

function App() {
  const [lions, setLions] = useState(initialLions); // 여기로 이동

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage lions={lions} setLions={setLions} />} />
        <Route path="/lions/:id" element={<DetailPage lions={lions} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;