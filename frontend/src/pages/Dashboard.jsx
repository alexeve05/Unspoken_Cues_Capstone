import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import EventCard from "../components/EventCard";
import { dashboardData } from "../data/mockData";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Header />

        <section className="stats-grid">
          <StatCard
            title="Total Guests"
            value={dashboardData.totalGuests}
          />

          <StatCard
            title="Active Events"
            value={dashboardData.activeEvents}
          />

          <StatCard
            title="Checked In"
            value={dashboardData.checkedInGuests}
          />
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Events</h2>
          </div>

          <div className="events-list">
            {dashboardData.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>

          <div className="activity-list">
            <p>Alice Smith checked in</p>
            <p>Guest record updated</p>
            <p>New guest registered</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;