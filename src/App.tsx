import { Dashboard } from './components/Dashboard';
import { DownloadPage } from './components/DownloadPage';
import { AppProvider } from './context/AppContext';

function App() {
  const path = window.location.pathname;
  
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
