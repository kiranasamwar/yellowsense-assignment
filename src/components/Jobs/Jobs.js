import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card'; // Import TinderCard for swipe functionality
import './Jobs.css';

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      page: 1,
      isLoading: false,
      error: null,
      hasMore: true,
      jobIds: new Set(),
      redirectToJob: null,
      redirectToBookmarks: false,
      swipeAction: null, // State to show swipe action (bookmark/dismiss)
    };

    this.fetchJobs = this.fetchJobs.bind(this);
  }

  componentDidMount() {
    this.fetchJobs();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  fetchJobs = async () => {
    const { page, isLoading, hasMore, jobIds } = this.state;

    if (isLoading || !hasMore) return;

    this.setState({ isLoading: true });

    try {
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const data = await response.json();

      if (Array.isArray(data.results)) {
        const newJobs = data.results.filter((job) => {
          if (jobIds.has(job.id)) {
            return false;
          }
          jobIds.add(job.id);
          return true;
        });

        this.setState((prevState) => ({
          jobs: [...prevState.jobs, ...newJobs],
          hasMore: page < 2,
        }));
      } else {
        throw new Error('Jobs data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.setState({ error: 'Error fetching jobs' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleJobClick = (id) => {
    this.setState({ redirectToJob: id });
  };

  handleSwipe = (direction, job) => {
    if (direction === 'right') {
      this.setState({ swipeAction: 'bookmark' }, () => {
        setTimeout(() => {
          this.setState({ swipeAction: null });
        }, 1000);
      });
      this.handleBookmarkClick(job); // Bookmark the job on right swipe
    } else if (direction === 'left') {
      this.setState({ swipeAction: 'dismiss' }, () => {
        setTimeout(() => {
          this.setState({ swipeAction: null });
        }, 1000);
      });
      this.handleRemoveJob(job); // Remove the job on left swipe
    }
  };

  handleRemoveJob = (job) => {
    this.setState((prevState) => ({
      jobs: prevState.jobs.filter((j) => j.id !== job.id),
    }));
  };

  handleBookmarkClick = (job) => {
    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    const isBookmarked = bookmarkedJobs.some((b) => b.id === job.id);

    if (isBookmarked) {
      return;
    }

    bookmarkedJobs.push(job);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
  };

  render() {
    const { jobs, isLoading, error, hasMore, redirectToJob, redirectToBookmarks, swipeAction } = this.state;

    if (redirectToJob) {
      return <Navigate to={`/job/${redirectToJob}`} />;
    }

    if (redirectToBookmarks) {
      return <Navigate to="/bookmarks" />;
    }

    return (
      <div className="jobs-container">
        <button className='bookmark-button btn3' onClick={() => this.setState({ redirectToBookmarks: true })}>Bookmarks Page</button>
        <h1 className='main-heading-jobs'>JOBS PAGE</h1>
        {jobs.length > 0 ? (
          <div className="tinder-cards" id='swiper'>
            {jobs.map((job) => (
              <TinderCard
                key={job.id}
                onSwipe={(direction) => this.handleSwipe(direction, job)}
                onCardLeftScreen={() => this.handleRemoveJob(job)} // Ensure job is removed from state after swiping off screen
              >
                <div className="job-card">
                  {job.title && <h2 className='job-title'>{job.title}</h2>}
                  {job.primary_details?.Place && (
                    <p className='details'>
                      <strong className='details'>Location:</strong> {job.primary_details.Place}
                    </p>
                  )}
                  {job.primary_details?.Salary && (
                    <p className='details'>
                      <strong className='details'>Salary:</strong> {job.primary_details.Salary}
                    </p>
                  )}
                  {job.whatsapp_no && (
                    <p className='details'>
                      <strong className='details'>Phone:</strong> {job.whatsapp_no}
                    </p>
                  )}
                  {job.company_name && (
                    <p className='details'>
                      <strong className='details'>Company:</strong> {job.company_name}
                    </p>
                  )}
                </div>
              </TinderCard>
            ))}
            {/* Show swipe action feedback (bookmark or dismiss) */}
            <div className='bookamrk-dismiss-action-conatiner'>
              {swipeAction === 'bookmark' && <div className="swipe-indicator bookmark-indicator">Bookmarked!</div>}
              {swipeAction === 'dismiss' && <div className="swipe-indicator dismiss-indicator">Dismissed!</div>}
            </div>
          </div>
        ) : (
          <p className='no-jobs-available-loading-line'>No jobs available</p>
        )}

        {isLoading && <p className='no-jobs-available-loading-line'>Loading more jobs...</p>}
        {error && <p className='no-jobs-available-loading-line'>{error}</p>}
        {!hasMore && !isLoading && <p >No more jobs to load.</p>}
      </div>
    );
  }
}

export default Jobs;
