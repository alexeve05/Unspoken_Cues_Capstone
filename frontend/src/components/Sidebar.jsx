function Sidebar() {
    return (
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Unspoken Cues</h2>
          <p>Staff Platform</p>
        </div>
  
        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Guests</button>
          <button className="nav-item">QR Lookup</button>
          <button className="nav-item">Events</button>
        </nav>
      </aside>
    );
  }
  
  export default Sidebar;