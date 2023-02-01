import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/main.css";
import App from './App';

ReactDOM.render(
  <Suspense fallback={(<div></div>)}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Suspense>,
  document.getElementById('root')
);

reportWebVitals();
