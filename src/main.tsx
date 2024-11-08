// index.tsx
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './providers/store';
import App from './App';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!); // Utilisation de createRoot

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);