import React from 'react';
import { useRecoilState } from 'recoil';
import { 
  filterState, 
  todoCountState, 
  isDarkModeState, 
  userPreferencesState 
} from '../recoil/atoms';

export default function AtomDemo() {
  // 1. String atom
  const [filter, setFilter] = useRecoilState(filterState);
  
  // 2. Number atom
  const [count, setCount] = useRecoilState(todoCountState);
  
  // 3. Boolean atom
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);
  
  // 4. Object atom
  const [preferences, setPreferences] = useRecoilState(userPreferencesState);

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc',
      backgroundColor: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#fff' : '#333'
    }}>
      <h3>Atom Types Demo</h3>

      {/* String Atom Demo */}
      <div>
        <h4>Filter (String Atom):</h4>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <p>Current filter: {filter}</p>
      </div>

      {/* Number Atom Demo */}
      <div>
        <h4>Counter (Number Atom):</h4>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <p>Count: {count}</p>
      </div>

      {/* Boolean Atom Demo */}
      <div>
        <h4>Dark Mode (Boolean Atom):</h4>
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          Toggle Dark Mode
        </button>
        <p>Dark mode is: {isDarkMode ? 'ON' : 'OFF'}</p>
      </div>

      {/* Object Atom Demo */}
      <div>
        <h4>User Preferences (Object Atom):</h4>
        <div>
          <label>
            Language:
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences({
                ...preferences,
                language: e.target.value
              })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Notifications:
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: e.target.checked
              })}
            />
          </label>
        </div>
        <p>Current preferences: {JSON.stringify(preferences, null, 2)}</p>
      </div>
    </div>
  );
} 