# Calculator (React + Vite)

This small project is a simple calculator built on top of the Vite + React template. It demonstrates a compact single-file React component implementing a calculator UI with keyboard support.

Features
- Basic arithmetic: +, -, ×, ÷
- Parentheses for grouping
- Decimal numbers
- Clear (C), Backspace (⌫), and Equals (=)
- Keyboard support: numbers, ., + - * /, Enter, Backspace, C

Run locally
1. Install dependencies:

```powershell
npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Open http://localhost:5173 (or the URL printed by Vite) and try the calculator.

Notes
- The expression evaluator uses a small sanitization step and the Function constructor to evaluate arithmetic expressions. It is intended for local/demo use only and not for executing untrusted input on servers.
- If you'd like, I can add tests, more advanced parsing, or keyboard focus handling next.
