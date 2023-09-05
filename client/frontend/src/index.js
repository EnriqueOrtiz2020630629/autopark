import React from 'react';
import ReactDOM from 'react-dom/client';
import {SesionContextoProvider} from './SesionContexto';
//import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SesionContextoProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SesionContextoProvider>);
