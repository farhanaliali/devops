import { useState } from "react";

function App() {
  const [apiUrl, setApiUrl] = useState("");
  const [response, setResponse] = useState(null);

  const callApi = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to fetch" });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>API Tester</h2>
      <input
        type="text"
        placeholder="Enter API URL"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />
      <button onClick={callApi} style={{ marginLeft: "10px", padding: "8px" }}>
        Send Request
      </button>
      <pre style={{ marginTop: "20px", background: "#f4f4f4", padding: "10px" }}>
        {response ? JSON.stringify(response, null, 2) : "No response yet"}
      </pre>
    </div>
  );
}

export default App;
