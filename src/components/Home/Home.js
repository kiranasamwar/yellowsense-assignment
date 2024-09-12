
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home = () => {
    const navigate=useNavigate();
    const jobs=()=>{
        navigate('/jobs')
    }
    const Book=()=>{
        navigate('/bookmarks')
    }

  return (
    <div className='container'>
        <h1 className='main-heading'>Welcome To The YellowSense Technologies </h1>
        <div className='buttons-container '>
        <button type='button' className='btn jobs-button' onClick={jobs}>Jobs</button>
        <button type='button' className='btn bookmarks-button' onClick={Book}>BookMarks</button>
        </div>
        
    </div>
  );
};

export default Home;
