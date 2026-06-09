import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DownloadPage } from './components/DownloadPage';
import { AppProvider } from './context/AppContext';

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const path = hash.replace(/^#/, '');

  if (path === '/download' || path === '/download/') {
    return <DownloadPage />;
  }

  return (
    <AppProvider>
      <div className="h-screen overflow-hidden bg-slate-950">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;
