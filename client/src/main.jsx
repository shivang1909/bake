// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { RouterProvider } from 'react-router-dom'
// import router from './route/index'
// import { Provider } from 'react-redux'
// import { store } from './store/store.js'

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//   <Provider store={store}>
//     <RouterProvider router={router}/>
//   </Provider>
//   // </StrictMode>,
// )
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './route/index';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>

);
