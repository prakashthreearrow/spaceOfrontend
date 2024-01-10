import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ContactBook from './Component/ContactBook';
import AddUser from "./Component/AddUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<ContactBook />} />
        <Route path="/user" exact element={<AddUser />} />
      </Routes>
    </Router>
  );
}

export default App;
