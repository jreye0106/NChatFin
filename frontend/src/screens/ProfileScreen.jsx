import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";
import UISection from "../components/ui/UISection";
import UIToggle from "../components/ui/UIToggle";
import UIButton from "../components/ui/UIButton";

export default function ProfileScreen({ user, token }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);

  // Load fresh profile data
  useEffect(() => {
    const load = async () => {
      const data = await apiGet("/api/profile/me", token);
      setProfile(data);
    };
    load();
  }, [token]);

  if (!profile) {
    return <div style={{ padding: 20 }}>Loading profile…</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header with theme color */}
      <div
        style={{
          ...styles.header,
          background: profile.themeColor || "#4f7cff",
        }}
      >
        <img
          src={profile.avatar || "/default-avatar.png"}
          style={styles.avatar}
        />

        <div style={styles.headerText}>
          <div style={styles.username}>{profile.username}</div>
          <div style={styles.status}>{profile.status}</div>
        </div>
      </div>

      {/* About Section */}
      <UISection title="About">
        <div style={styles.text}>{profile.about}</div>
      </UISection>

      {/* Bio Section */}
      <UISection title="Bio">
        <div style={styles.text}>
          {profile.bio || "No bio added yet."}
        </div>
      </UISection>

      {/* Privacy Section */}
      <UISection title="Privacy">
        <UIToggle
          label="Show Online Status"
          checked={profile.statusVisible}
          disabled={true} // Only editable in Edit Profile
        />
      </UISection>

      {/* Theme Section */}
      <UISection title="Theme Color">
        <div style={styles.colorPreviewRow}>
          <div
            style={{
              ...styles.colorPreview,
              background: profile.themeColor,
            }}
          />
          <span style={styles.colorLabel}>{profile.themeColor}</span>
        </div>
      </UISection>

      {/* Edit Button */}
      <div style={styles.editContainer}>
        <UIButton
          label="Edit Profile"
          onClick={() =>
            navigate("/app/profile/edit", { state: { user: profile } })
          }
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: "100px",
  },
  header: {
    padding: "24px",
    display: "flex",
    alignItems: "center",
    color: "white",
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid white",
    marginRight: "16px",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
  },
  username: {
    fontSize: "20px",
    fontWeight: 700,
  },
  status: {
    fontSize: "14px",
    opacity: 0.9,
  },
  text: {
    fontSize: "15px",
    opacity: 0.8,
    lineHeight: "20px",
  },
  colorPreviewRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px",
  },
  colorPreview: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #ddd",
  },
  colorLabel: {
    fontSize: "14px",
    opacity: 0.7,
  },
  editContainer: {
    padding: "20px",
  },
};
