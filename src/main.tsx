import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { AuthContextProvider } from './context/authContext';
import './styles/global.scss';
import { Provider } from 'react-redux';
import { store } from './store/store';
import "react-datepicker/dist/react-datepicker.css"
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Navbar>
            <App />
          </Navbar>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  </AuthContextProvider>

);
