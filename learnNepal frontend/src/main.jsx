import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppContextProvider } from './context/AppContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from '../socketContext.jsx';

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </SocketProvider>
);
