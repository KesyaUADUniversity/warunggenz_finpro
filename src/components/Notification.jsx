import { useState, useEffect } from 'react';

export default function Notification({ message, type = 'success', duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
      ? 'bg-red-500' 
      : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg text-white font-medium shadow-lg ${bgColor} animate-fadeIn`}>
      {message}
    </div>
  );
}