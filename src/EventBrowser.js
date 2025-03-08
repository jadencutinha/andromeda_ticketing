import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

function EventBrowser({categoryFilter}) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace with API call to fetch events later
    // Example:
    // axios.get('/api/events').then(response => setEvents(response.data));
    // For now, use mock data:
    const mockEvents = [
      { id: 1, title: 'React Conference', description: 'A great conference!', image: 'https://via.placeholder.com/345x140', category: 'Technology' },
      { id: 2, title: 'JS Meetup', description: 'Discussing JavaScript.', image: 'https://via.placeholder.com/345x140', category: 'Technology'  },
      { id: 3, title: 'EDC', description: 'Dance music.', image: 'https://via.placeholder.com/345x140', category: 'Music'  }
    ];
    setEvents(mockEvents);

  }, []);

  const filteredEvents = categoryFilter === 'All' ? events : events.filter(event => event.category === categoryFilter);

  return (
    <div>
      <h1>Event Browser</h1>
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventBrowser;