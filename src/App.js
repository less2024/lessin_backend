import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// routes
import Router from './routes';

// theme
import ThemeProvider from './theme';

// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// Context
import UserContextProvider from './hooks/userUse';

// Scss genral
import './assets/css/global.scss';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <UserContextProvider>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
          </ThemeProvider>
        </UserContextProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
