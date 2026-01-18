import { TelepartyProvider, useTeleparty } from './context/TelepartyContext';
import { Home } from './components/Home';
import { ChatRoom } from './components/ChatRoom';
import './App.css';

function AppContent() {
  const { view } = useTeleparty();

  return view === 'chat' ? <ChatRoom /> : <Home />;
}

function App() {
  return (
    <TelepartyProvider>
      <AppContent />
    </TelepartyProvider>
  );
}

export default App;
