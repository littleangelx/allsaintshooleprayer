"use client";

import { useState } from "react";

export default function UploadForm({ endpoint, label }) {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccess(null);
    setError(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(result.error || "Upload failed");
      return;
    }

    setSuccess(`Uploaded ${result.count} names successfully`);
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : `Upload ${label}`}
      </button>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
