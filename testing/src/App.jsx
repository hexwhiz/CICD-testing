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
  const [dark, setDark] = useState(false)
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
    if (value === '±') {
      // toggle sign of the last number in the expression
      setExpr((s) => {
        if (!s) return s
        // replace last number
        return s.replace(/(-?\d*\.?\d+)$/,(m)=> (m.startsWith('-') ? m.slice(1) : '-' + m))
      })
      return
    }
    if (value === '%') {
      // convert current value to percentage (divide by 100)
      const res = evaluateExpression(expr || display)
      if (res === 'Error') {
        setDisplay('Error')
        setExpr('')
      } else {
        const perc = String(Number(res) / 100)
        setExpr(perc)
        setDisplay(perc)
      }
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
     'C', '±', '%', '÷',
     '7', '8', '9', '×',
     '4', '5', '6', '-',
     '1', '2', '3', '+',
     '0', '.', '=',
  ]

  return (
    <div className={`app ${dark ? 'theme-dark' : 'theme-light'}`} ref={containerRef}>
      <div className="calculator">
        <div className="header">
          <button className="switch" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
            <span className="switch-dot" />
            <span>{dark ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
          <div className="notch" />
        </div>
        <div className="display" role="status" aria-live="polite">
          <div className="expr">{expr || ' '}</div>
          <div className="value">{display}</div>
        </div>
        <div className="keys">
          {buttons.map((b, i) => {
            const isDigit = /\d/.test(b)
            const isOperator = ['÷', '×', '+', '-'].includes(b)
            const classes = ['key']
            if (isDigit) classes.push('digit')
            if (b === '0') classes.push('zero')
            if (b === '=') classes.push('equals')
            if (isOperator) classes.push('operator')
            if (['C','±','%'].includes(b)) classes.push('func')
            return (
              <button
                key={b + i}
                className={classes.join(' ')}
                onClick={() => press(b)}
                aria-label={b}
              >
                {b}
              </button>
            )
          })}
        </div>
      </div>
      <p className="hint">Tip: use keyboard numbers, Enter for =, Backspace to delete, C to clear.</p>
    </div>
  )
}
