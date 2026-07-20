import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1">
        <DashboardPage />
      </div>
    </div>
  );
}

export default App;

