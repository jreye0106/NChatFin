import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import { useTheme } from "../styles/ThemeContext";

export default function FriendsScreen({ user, token }) {
  const { theme } = useTheme();

  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const inc = await apiGet("/api/friends/incoming", token);
    const out = await apiGet("/api/friends/outgoing", token);
    const fr = await apiGet("/api/friends/list", token);

    setIncoming(inc || []);
    setOutgoing(out || []);
    setFriends(fr || []);

    setLoading(false);
  };

  const accept = async (id) => {
    await apiPost(`/api/friends/accept/${id}`, {}, token);
    loadData();
  };

  const decline = async (id) => {
    await apiPost(`/api/friends/decline/${id}`, {}, token);
    loadData();
  };

  const cancel = async (id) => {
    await apiPost(`/api/friends/cancel/${id}`, {}, token);
    loadData();
  };

  const remove = async (id) => {
    await apiPost(`/api/friends/remove/${id}`, {}, token);
    loadData();
  };

  return (
    <div style={{ padding: 16 }}>
      {loading && <p style={{ opacity: 0.6 }}>Loading…</p>}

      {!loading && (
        <>
          {/* Incoming Requests */}
          <Section title="Incoming Requests">
            {incoming.length === 0 && (
              <Empty label="No incoming requests" />
            )}

            {incoming.map((req) => (
              <UserRow
                key={req._id}
                user={req.requester}
                actions={
                  <>
                    <Button
                      label="Accept"
                      color={theme.colors.primary}
                      onClick={() => accept(req._id)}
                    />
                    <Button
                      label="Decline"
                      color="#999"
                      onClick={() => decline(req._id)}
                    />
                  </>
                }
              />
            ))}
          </Section>

          {/* Pending Requests */}
          <Section title="Pending Requests">
            {outgoing.length === 0 && (
              <Empty label="No pending requests" />
            )}

            {outgoing.map((req) => (
              <UserRow
                key={req._id}
                user={req.recipient}
                actions={
                  <Button
                    label="Cancel"
                    color="#999"
                    onClick={() => cancel(req._id)}
                  />
                }
              />
            ))}
          </Section>

          {/* Friends */}
          <Section title="Friends">
            {friends.length === 0 && (
              <Empty label="You have no friends yet" />
            )}

            {friends.map((f) => {
              const other =
                f.requester._id === user._id
                  ? f.recipient
                  : f.requester;

              return (
                <UserRow
                  key={f._id}
                  user={other}
                  actions={
                    <Button
                      label="Remove"
                      color="#ff4d4d"
                      onClick={() => remove(f._id)}
                    />
                  }
                />
              );
            })}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.colors.card,
        padding: 12,
        borderRadius: 16,
        marginBottom: 20,
        boxShadow: theme.shadow.soft,
      }}
    >
      <h3 style={{ marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

function UserRow({ user, actions }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
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

      {actions}
    </div>
  );
}

function Button({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 10,
        border: "none",
        background: color,
        color: "white",
        cursor: "pointer",
        marginLeft: 8,
      }}
    >
      {label}
    </button>
  );
}

function Empty({ label }) {
  return (
    <p style={{ opacity: 0.6, margin: 0, paddingBottom: 10 }}>{label}</p>
  );
}
