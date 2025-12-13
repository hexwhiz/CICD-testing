import { useEffect, useRef, useState } from 'react'
import './App.css'

function formatDisplay(value) {
  if (value === '') return '0'
  return value
}

function evaluateExpression(expr) {
  try {
    // replace unicode operators with JS operators
    const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/')
    // Prevent dangerous characters (very basic sanitization)
    if (/[^0-9.+\-*/()% ]/.test(sanitized)) return 'Error'
    // eslint-disable-next-line no-new-func
    const result = Function(`return (${sanitized})`)()
    if (result === Infinity || Number.isNaN(result)) return 'Error'
    return String(result)
  } catch (e) {
    return 'Error'
  }
}

export default function App() {
  const [expr, setExpr] = useState('')
  const [display, setDisplay] = useState('0')
  const containerRef = useRef(null)

  useEffect(() => {
    setDisplay(formatDisplay(expr))
  }, [expr])

  useEffect(() => {
    function onKey(e) {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        setExpr((s) => s + e.key)
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        const op = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key
        setExpr((s) => s + op)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const res = evaluateExpression(expr)
        setExpr(res === 'Error' ? '' : res)
        setDisplay(res)
      } else if (e.key === 'Backspace') {
        setExpr((s) => s.slice(0, -1))
      } else if (e.key.toLowerCase() === 'c') {
        setExpr('')
        setDisplay('0')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expr])

  function press(value) {
    if (value === 'C') {
      setExpr('')
      setDisplay('0')
      return
    }
    if (value === '⌫') {
      setExpr((s) => s.slice(0, -1))
      return
    }
    if (value === '=') {
      const res = evaluateExpression(expr)
      setDisplay(res)
      setExpr(res === 'Error' ? '' : res)
      return
    }
    setExpr((s) => s + value)
  }

  const buttons = [
    'C', '⌫', '(', ')',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ]

  return (
    <div className="app" ref={containerRef}>
      <h1>Calculator</h1>
      <div className="calculator">
        <div className="display" role="status" aria-live="polite">
          <div className="expr">{expr || ' '}</div>
          <div className="value">{display}</div>
        </div>
        <div className="keys">
          {buttons.map((b) => (
            <button
              key={b}
              className={`key ${/\d/.test(b) ? 'digit' : ''} ${b === '=' ? 'equals' : ''}`}
              onClick={() => press(b)}
              aria-label={b}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <p className="hint">Tip: use keyboard numbers, Enter for =, Backspace to delete, C to clear.</p>
    </div>
  )
}
