import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store.js'
import './i18n'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  captureUncaught: true,
  captureUnhandledRejections: true,
}
console.log(rollbarConfig.environment)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary
        fallbackUI={() => (
          <div style={{ padding: '20px', color: 'red' }}>
            <h2>Что-то пошло не так</h2>
          </div>
        )}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode >
)
