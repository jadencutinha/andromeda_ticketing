// src/EventBrowser.js
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

function EventBrowser() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace with API call to fetch events later
    // Example:
    // axios.get('/api/events').then(response => setEvents(response.data));
    // For now, use mock data:
    const mockEvents = [
      { id: 1, title: 'React Conference', description: 'A great conference!', image: 'https://via.placeholder.com/345x140' },
      { id: 2, title: 'JS Meetup', description: 'Discussing JavaScript.', image: 'https://via.placeholder.com/345x140' }
    ];
    setEvents(mockEvents);

  }, []);

  return (
    <div>
      <h1>Event Browser</h1>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventBrowser;