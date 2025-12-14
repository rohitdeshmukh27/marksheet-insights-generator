import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UploadCard from "./components/UploadCard";
import Results from "./components/Results";

function MainApp() {
  const [data, setData] = useState(null);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Marksheet → Insights Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
        <UploadCard onResult={setData} />
        {data && <Results data={data} />}
      </div>
    </div>
  );
}

function AuthScreen() {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login onToggle={() => setShowLogin(false)} />
  ) : (
    <SignUp onToggle={() => setShowLogin(true)} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user ? <MainApp /> : <AuthScreen />;
}
