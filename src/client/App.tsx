import { useState } from 'react';

export const App = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  function save(newTitle: string) {
    setUsername(newTitle);
    localStorage.setItem('username', name);
  }

  return (
    <input
      type="text"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
    />
  );
};
