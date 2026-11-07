import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Self-hosted fonts — bundled with the site, so they always load fast and show properly.
// Only the weights the design uses; browsers fetch just the character sets a page needs.
import '@fontsource/great-vibes/400.css'; //            calligraphy: Aditi & Jeet
import '@fontsource/playfair-display/400.css'; //       display: headings, names, numbers
import '@fontsource/playfair-display/500.css';
import '@fontsource/cinzel/600.css'; //                 royal labels
import '@fontsource/cormorant-garamond/500.css'; //     poetic lines
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/montserrat/400.css'; //             details & buttons
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
