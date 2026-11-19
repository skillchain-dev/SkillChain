import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../routes/index.jsx';
import AppProviders from './providers.jsx';
import '../styles/index.css';
export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}
