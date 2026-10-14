import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RunGame from './game.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RunGame />
  </StrictMode>,
)
