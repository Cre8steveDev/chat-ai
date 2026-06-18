import { Link } from "react-router-dom";

function ChatPage() {
  return (
    <main className="page chat-page">
      <section className="chat-shell">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Live Banter</p>
            <h1>Football AI Chat</h1>
          </div>
          <Link to="/" className="back-link">
            Back Home
          </Link>
        </header>

        <div className="chat-placeholder">
          <p>Your chat interface will go here in the next phase.</p>
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
