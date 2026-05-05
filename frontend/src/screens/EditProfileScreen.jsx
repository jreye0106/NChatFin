import { useState, useEffect } from "react";
import { apiGet, apiPut, apiPost } from "../api";
import UIInput from "../components/ui/UIInput";
import UITextArea from "../components/ui/UITextArea";
import UIToggle from "../components/ui/UIToggle";
import UIButton from "../components/ui/UIButton";
import UISection from "../components/ui/UISection";

export default function EditProfileScreen({ user, token }) {
  const [form, setForm] = useState({
    username: user.username,
    bio: user.bio || "",
    status: user.status || "Available",
    themeColor: user.themeColor || "#4f7cff",
    statusVisible: user.statusVisible ?? true,
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);

  // -----------------------------
  // Handle avatar selection
  // -----------------------------
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // -----------------------------
  // Save profile changes
  // -----------------------------
  const handleSave = async () => {
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);

        const uploaded = await apiPost("/api/profile/avatar", fd, token);
        form.avatar = uploaded.url;
      }

      // Save text fields
      await apiPut("/api/profile/update", form, token);

      alert("Profile updated");
      window.history.back();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // -----------------------------
  // Update form fields
  // -----------------------------
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // -----------------------------
  // Theme color options
  // -----------------------------
  const colors = ["#4f7cff", "#ff4f81", "#4fd1c5", "#ffb84f", "#8a4fff"];

  return (
    <div style={styles.container}>
      {/* Avatar Section */}
      <UISection title="Profile Photo">
        <div style={styles.avatarRow}>
          <img
            src={avatarPreview || "/default-avatar.png"}
            style={styles.avatar}
          />
          <div>
            <label htmlFor="avatarInput" style={styles.changePhoto}>
              Change Photo
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </UISection>

      {/* Identity Section */}
      <UISection title="Identity">
        <UIInput
          label="Display Name"
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
        />

        <UITextArea
          label="Bio"
          value={form.bio}
          onChange={(e) => updateField("bio", e.target.value)}
        />

        <UIInput
          label="Status Message"
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
        />
      </UISection>

      {/* Theme Section */}
      <UISection title="Theme Color">
        <div style={styles.colorRow}>
          {colors.map((c) => (
            <div
              key={c}
              onClick={() => updateField("themeColor", c)}
              style={{
                ...styles.colorDot,
                background: c,
                border:
                  form.themeColor === c
                    ? "3px solid black"
                    : "2px solid #ddd",
              }}
            />
          ))}
        </div>
      </UISection>

      {/* Privacy Section */}
      <UISection title="Privacy">
        <UIToggle
          label="Show Online Status"
          checked={form.statusVisible}
          onChange={(val) => updateField("statusVisible", val)}
        />
      </UISection>

      {/* Save Button */}
      <div style={styles.saveContainer}>
        <UIButton label="Save Changes" onClick={handleSave} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "16px",
    paddingBottom: "100px",
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  changePhoto: {
    color: "#4f7cff",
    fontWeight: 600,
    cursor: "pointer",
  },
  colorRow: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },
  colorDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  saveContainer: {
    marginTop: "20px",
  },
};
