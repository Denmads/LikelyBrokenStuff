import { useState } from 'react'
import '../styles/PasswordGenerator.css'

function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(3)
  const [style, setStyle] = useState<'word' | 'predictable' | 'obvious'>('word')

  const badPasswords = {
    word: [
      'meh', 'ok', 'eh', 'ugh', 'blah', 'meh', 'whatever', 'fine', 'sure', 'nope',
      'yep', 'nah', 'ehhh', 'hmm', 'uhhh', 'oof', 'ouch', 'yikes', 'yay', 'boo',
      'duh', 'huh', 'psst', 'eww', 'ick', 'pfft', 'poof', 'boom', 'pow', 'zap'
    ],
    predictable: [
      '123', '456', '789', '111', '222', '333', '444', '555', '666', '777',
      '888', '999', '000', '121', '131', '141', '151', '161', '171', '181'
    ],
    obvious: [
      'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz', 'password',
      'pass', 'admin', 'user', 'root', 'test', 'demo', 'guest', 'hello', 'world', 'qwerty'
    ]
  }

  const generatePassword = () => {
    let newPassword = ''
    const options = badPasswords[style]
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * options.length)
      newPassword += options[randomIndex]
      if (i < length - 1) newPassword += ''
    }
    
    setPassword(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
  }

  return (
    <div className="password-generator-container">
      <div className="password-header">
        <h1>Bad Password Generator</h1>
        <p className="password-subtitle">Generate hilariously terrible passwords</p>
      </div>

      <div className="password-controls">
        <div className="control-group">
          <label htmlFor="style">Password Style</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as 'word' | 'predictable' | 'obvious')}
            className="password-select"
          >
            <option value="word">Lazy Words (meh, ok, whatever)</option>
            <option value="predictable">Predictable Numbers (123, 456)</option>
            <option value="obvious">Obvious Choices (password, admin)</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="length">Number of Parts: {length}</label>
          <input
            id="length"
            type="range"
            min="1"
            max="5"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="password-slider"
          />
        </div>

        <button onClick={generatePassword} className="generate-button">
          Generate Terrible Password
        </button>
      </div>

      {password && (
        <div className="password-display">
          <div className="password-box">
            <code className="password-text">{password}</code>
            <button onClick={copyToClipboard} className="copy-button" title="Copy to clipboard">
              📋
            </button>
          </div>
          <p className="security-warning">⚠️ Warning: This password is hilariously insecure. Please don't actually use it!</p>
        </div>
      )}

      <div className="password-info">
        <h3>How Bad Is It?</h3>
        <ul>
          <li>✗ Uses common words and numbers</li>
          <li>✗ No special characters</li>
          <li>✗ Predictable patterns</li>
          <li>✗ Easy to guess</li>
          <li>✗ Laughably weak</li>
        </ul>
      </div>
    </div>
  )
}

export default PasswordGenerator
