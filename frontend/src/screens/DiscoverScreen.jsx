import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import { useTheme } from "../styles/ThemeContext";

export default function DiscoverScreen({ user, token, onIncomingChange }) {
  const { theme } = useTheme();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [suggested, setSuggested] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriendData();
    loadSuggestedUsers();
  }, []);

  const loadFriendData = async () => {
    const inc = await apiGet("/api/friends/incoming", token);
    const out = await apiGet("/api/friends/outgoing", token);
    const fr = await apiGet("/api/friends/list", token);

    setIncoming(inc || []);
    setOutgoing(out || []);
    setFriends(fr || []);

    onIncomingChange?.(inc?.length || 0);
  };

  const loadSuggestedUsers = async () => {
    const res = await apiGet("/api/friends/suggested", token);
    setSuggested(res || []);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim() !== "") searchUsers();
      else setResults([]);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    const res = await apiGet(`/api/friends/search?q=${query}`, token);
    setResults(res || []);
    setLoading(false);
  };

  // ------------------------------
  // NULL-SAFE HELPERS
  // ------------------------------

  const isFriend = (id) =>
    friends?.some((f) => f && f._id === id);

  const isOutgoing = (id) =>
    outgoing?.some((req) => req?.recipient?._id === id);

  const isIncoming = (id) =>
    incoming?.some((req) => req?.requester?._id === id);

  // ------------------------------
  // FRIEND ACTIONS
  // ------------------------------

  const sendRequest = async (id) => {
    await apiPost(`/api/friends/send/${id}`, {}, token);
    loadFriendData();
  };

  const acceptRequest = async (requestId) => {
    await apiPost(`/api/friends/accept/${requestId}`, {}, token);
    loadFriendData();
  };

  const declineRequest = async (requestId) => {
    await apiPost(`/api/friends/decline/${requestId}`, {}, token);
    loadFriendData();
  };

  const cancelRequest = async (requestId) => {
    await apiPost(`/api/friends/cancel/${requestId}`, {}, token);
    loadFriendData();
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search people…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.15)",
          marginBottom: 20,
          fontSize: 16,
          background: theme.colors.card,
          color: theme.colors.text,
        }}
      />

      {/* Incoming Requests */}
      {incoming.length > 0 && (
        <Section title="Friend Requests">
          {incoming
            .filter((req) => req?.requester) // prevent null crash
            .map((req) => (
              <IncomingRow
                key={req._id}
                user={req.requester}
                theme={theme}
                onAccept={() => acceptRequest(req._id)}
                onDecline={() => declineRequest(req._id)}
              />
            ))}
        </Section>
      )}

      {/* Outgoing Requests */}
      {outgoing.length > 0 && (
        <Section title="Pending Requests">
          {outgoing
            .filter((req) => req?.recipient)
            .map((req) => (
              <OutgoingRow
                key={req._id}
                user={req.recipient}
                theme={theme}
                onCancel={() => cancelRequest(req._id)}
              />
            ))}
        </Section>
      )}

      {/* Suggested Users */}
      {suggested.length > 0 && (
        <Section title="Suggested Users">
          {suggested
            .filter((u) => u)
            .map((u) => (
              <UserRow
                key={u._id}
                user={u}
                theme={theme}
                isFriend={isFriend(u._id)}
                isOutgoing={isOutgoing(u._id)}
                isIncoming={isIncoming(u._id)}
                onAdd={() => sendRequest(u._id)}
              />
            ))}
        </Section>
      )}

      {/* Search Results */}
      {query && (
        <>
          {loading && <p style={{ opacity: 0.6 }}>Searching…</p>}

          {results.length > 0 && (
            <Section title="Search Results">
              {results
                .filter((u) => u && u._id !== user._id)
                .map((u) => (
                  <UserRow
                    key={u._id}
                    user={u}
                    theme={theme}
                    isFriend={isFriend(u._id)}
                    isOutgoing={isOutgoing(u._id)}
                    isIncoming={isIncoming(u._id)}
                    onAdd={() => sendRequest(u._id)}
                  />
                ))}
            </Section>
          )}

          {!loading && results.length === 0 && (
            <p style={{ opacity: 0.6 }}>No users found.</p>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------
   UI COMPONENTS
------------------------------ */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 10, opacity: 0.8 }}>{title}</h3>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function IncomingRow({ user, theme, onAccept, onDecline }) {
  if (!user) return null; // safety
  return (
    <UserRowBase user={user} theme={theme}>
      <button
        onClick={onAccept}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          border: "none",
          background: theme.colors.primary,
          color: "white",
          marginRight: 8,
        }}
      >
        Accept
      </button>
      <button
        onClick={onDecline}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          border: "1px solid #ccc",
          background: "white",
        }}
      >
        Decline
      </button>
    </UserRowBase>
  );
}

function OutgoingRow({ user, theme, onCancel }) {
  if (!user) return null;
  return (
    <UserRowBase user={user} theme={theme}>
      <button
        onClick={onCancel}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          border: "none",
          background: "#ddd",
        }}
      >
        Cancel
      </button>
    </UserRowBase>
  );
}

function UserRow({ user, theme, isFriend, isOutgoing, isIncoming, onAdd }) {
  if (!user) return null;

  let button = null;

  if (isFriend) {
    button = <span style={{ opacity: 0.6 }}>Friends</span>;
  } else if (isOutgoing) {
    button = <span style={{ opacity: 0.6 }}>Request Sent</span>;
  } else if (isIncoming) {
    button = <span style={{ opacity: 0.6 }}>Requested You</span>;
  } else {
    button = (
      <button
        onClick={onAdd}
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          border: "none",
          background: theme.colors.primary,
          color: "white",
        }}
      >
        Add
      </button>
    );
  }

  return (
    <UserRowBase user={user} theme={theme}>
      {button}
    </UserRowBase>
  );
}

function UserRowBase({ user, theme, children }) {
  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={user.avatar || "/default-avatar.png"}
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          marginRight: 14,
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{user.username}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{user.email}</div>
      </div>

      {children}
    </div>
  );
}
