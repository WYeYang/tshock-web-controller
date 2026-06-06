import { Dashboard } from './components/Dashboard';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="h-screen overflow-hidden bg-slate-950">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;
