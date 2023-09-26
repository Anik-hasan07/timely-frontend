import { deepOrange, orange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { persistor, store } from './store';

const theme = createTheme({
  palette: {
    primary: { main: deepOrange[500] },
    secondary: { main: orange[500] },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} persistor={persistor}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
