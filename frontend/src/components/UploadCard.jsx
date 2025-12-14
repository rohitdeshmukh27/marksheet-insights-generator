import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

export default function UploadCard({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Choose a file");
      return;
    }
    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);

    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Please sign in to upload");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/analyze", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      onResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <input
        type="file"
        accept=".csv,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
