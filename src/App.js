import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Jobs from './components/Jobs/Jobs';
import JobDetails from './components/JobDetails/JobDetails';
import Bookmarks from './components/Bookmarks/Bookmarks';
import Home from './components/Home/Home'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/jobs' element={<Jobs/>} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </Router>
  );
}

export default App;