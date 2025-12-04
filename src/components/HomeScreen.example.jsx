import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeScreen from './HomeScreen';

/**
 * Пример использования компонента HomeScreen
 * 
 * Этот файл демонстрирует, как интегрировать компонент в React-приложение
 */

// Вариант 1: Простое использование без дополнительных данных
function App() {
  return (
    <div className="App">
      <HomeScreen />
    </div>
  );
}

// Вариант 2: С React Router для навигации
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 
// function AppWithRouter() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/payments" element={<PaymentsScreen />} />
//         <Route path="/requests" element={<RequestsScreen />} />
//         <Route path="/counters" element={<CountersScreen />} />
//         <Route path="/receipts" element={<ReceiptsScreen />} />
//         <Route path="/notifications" element={<NotificationsScreen />} />
//       </Routes>
//     </Router>
//   );
// }

// Вариант 3: С контекстом для данных пользователя
// import { createContext, useContext, useState } from 'react';
// 
// const UserContext = createContext();
// 
// function AppWithContext() {
//   const [userData, setUserData] = useState({
//     firstName: "Иван",
//     lastName: "Иванов",
//     apartments: [
//       { id: 1, number: "15", building: 1 }
//     ]
//   });
// 
//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       <HomeScreen />
//     </UserContext.Provider>
//   );
// }

// Монтирование приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
