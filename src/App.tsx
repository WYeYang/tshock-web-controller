import { Dashboard } from './components/Dashboard';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="h-screen overflow-hidden">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;
