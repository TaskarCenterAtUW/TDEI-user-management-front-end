import React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'normalize.css';
import App from './components/App.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.Suspense><App /></React.Suspense>);
