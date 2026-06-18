import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

const starterMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Welcome to Football Banter. Pick a club, name a player, and I'll roast or praise with style.",
  },
];

const systemPrompt = `
You are a fun, witty Nigerian football banter.
Keep replies short, playful, and conversational, use PIDGIN ENGLISH WHERE POSSIBLE. Use puns, jokes and ALWAYS FIND A WAY TO PROVE THAT RONALDO IS A FLOP. EVEN WHEN THE CONVERSATION IS NOT ABOUT RONALDO. FIND A WAY TO BRING RONALDO INTO IT. 
Use football humor, club rivalry banter, and light teasing.
If the user mentions a club or player, respond like a confident football fan.
`;

const quickPrompts = [
  "Roast Man United",
  "Messi or Ronaldo?",
  "Why is my club cursed?",
  "Best Premier League player?",
];

const contacts = [
  { name: "Jontray Arnold", status: "Watching the match" },
  { name: "Kate Johnson", status: "Typing banter..." },
  { name: "Tobore Chukwuka", status: "Online now" },
  { name: "Jovial Osi", status: "Ready for a debate" },
];

const sharedFiles = [
  { label: "Documents", count: "12 files", tone: "docs" },
  { label: "Photos", count: "08 files", tone: "photos" },
  { label: "Videos", count: "04 files", tone: "videos" },
];

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

function ChatPage() {
  const [messages, setMessages] = useState(starterMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sidebar-menu-open", isMobileMenuOpen);

    return () => {
      document.body.classList.remove("sidebar-menu-open");
    };
  }, [isMobileMenuOpen]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...nextMessages.map((message) => ({
                role: message.role,
                content: message.text,
              })),
            ],
            temperature: 0.9,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: aiText || "I couldn't think of a comeback. Try that again.",
        },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Something went wrong getting the banter reply. Check your API key and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleQuickPromptClick = (prompt) => {
    setInputValue(prompt);
    closeMobileMenu();
  };

  const renderSidebarContent = () => (
    <>
      <div className="sidebar-topbar">
        <div className="logo-mark">⚽</div>
        <div className="sidebar-title-wrap">
          <p className="brand-kicker">Chat</p>
          <h2 className="brand-title">Football Banter</h2>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">JR</div>
        <h3>Jontray Arnold</h3>
        <p>Ready to back Ronaldo and start trouble.</p>
        <span className="profile-pill">Active fan</span>
      </div>

      <div className="sidebar-section">
        <div className="section-heading">
          <span>Quick chats</span>
          <span>{quickPrompts.length}</span>
        </div>
        <div className="quick-list">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="quick-item"
              onClick={() => handleQuickPromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-heading">
          <span>Last chats</span>
          <span>{contacts.length}</span>
        </div>
        <div className="contact-list">
          {contacts.map((contact) => (
            <div key={contact.name} className="contact-item">
              <div className="contact-avatar">
                {contact.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="contact-copy">
                <p>{contact.name}</p>
                <span>{contact.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderInfoContent = () => (
    <>
      <div className="info-card cover-card">
        <div className="cover-art">
          <span>Match room</span>
          <strong>Real estate deals</strong>
        </div>
        <h3>Shared files</h3>
        <p>Keep the banter sharp, playful, and football-first.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Clubs</span>
          <strong>231</strong>
        </div>
        <div className="stat-card">
          <span>Players</span>
          <strong>45</strong>
        </div>
      </div>

      <div className="info-card file-card">
        <div className="section-heading">
          <span>File type</span>
          <span>{sharedFiles.length}</span>
        </div>

        <div className="file-list">
          {sharedFiles.map((file) => (
            <div key={file.label} className="file-item">
              <span className={`file-dot ${file.tone}`} />
              <div>
                <p>{file.label}</p>
                <span>{file.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <main className="page chat-page">
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {isMobileMenuOpen ? (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close sidebar menu"
          onClick={closeMobileMenu}
        />
      ) : null}

      <aside className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div>
            <p className="eyebrow">Menu</p>
            <h2>Side panels</h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={closeMobileMenu}>
            Close
          </button>
        </div>

        <div className="mobile-drawer-sections">
          <section className="mobile-drawer-panel sidebar-panel">{renderSidebarContent()}</section>
          <section className="mobile-drawer-panel info-panel">{renderInfoContent()}</section>
        </div>
      </aside>

      <section className="dashboard-shell">
        <aside className="sidebar-panel left-panel">
          {renderSidebarContent()}
        </aside>

        <section className="chat-panel">
          <header className="chat-topbar">
            <div>
              <p className="eyebrow">Live Banter</p>
              <h1>Football AI Chat</h1>
            </div>

            <div className="chat-actions">
              <Link to="/" className="back-link">
                Back Home
              </Link>
              <button
                type="button"
                className="mobile-menu-toggle inline-toggle"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </header>

          <div className="conversation-card">
            <div className="conversation-toolbar">
              <div className="toolbar-title">
                <h3>Group Chat</h3>
                <p>Football banter room</p>
              </div>

              <div className="toolbar-tabs">
                <span className="tab-pill active">Messages</span>
                <span className="tab-pill">Participants</span>
              </div>
            </div>

            <div className="chat-window">
              <div className="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${message.role === "user" ? "user-row" : "assistant-row"}`}
                  >
                    <div className={`message-bubble ${message.role}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message-row assistant-row">
                    <div className="message-bubble assistant">
                      Thinking of a comeback...
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Write your message..."
                  className="chat-input"
                />
                <button type="submit" className="send-btn" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <aside className="info-panel">
          {renderInfoContent()}
        </aside>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
