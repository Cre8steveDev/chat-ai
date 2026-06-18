import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="page home-page">
      <section className="hero-card">
        <p className="eyebrow">AI Football Banter</p>
        <h1>Chat football. Argue hard. Keep it fun.</h1>
        <p className="subtitle">
          Pick your club, back your favorite player, and let the AI throw
          playful banter back at you.
        </p>

        <Link to="/chat" className="start-chat-btn">
          Start Chat
        </Link>
      </section>
    </main>
  );
}

export default HomePage;
