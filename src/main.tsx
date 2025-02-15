import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import store from './providers/store';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

// Crée une instance de QueryClient
const queryClient = new QueryClient();

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
