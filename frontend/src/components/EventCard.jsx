function EventCard({ event }) {
    return (
      <div className="event-card">
        <div>
          <h3>{event.name}</h3>
          <p>{event.date}</p>
          <p>{event.registeredGuests} registered guests</p>
        </div>
  
        <button className="secondary-button">View Guests</button>
      </div>
    );
  }
  
  export default EventCard;