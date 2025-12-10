import React, { useState, useEffect } from 'react';
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [message, setMessage] = useState('');

  const load = () =>
    fetch('http://localhost:5000/documents')
      .then(r => r.json())
      .then(d => setDocs(d.documents));

  useEffect(() => {
    load();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Select a PDF file first.");

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('http://localhost:5000/documents/upload', { method: 'POST', body: fd });
    const data = await res.json();

    setMessage(data.message);
    load();
  };

  const deleteDoc = async (id) => {
    await fetch(`http://localhost:5000/documents/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container">
      <h1>Patient Document Portal</h1>

      {message && <p className="message">{message}</p>}

      <form onSubmit={upload}>
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        <button>Upload</button>
      </form>

      <ul>
        {docs.map(d => (
          <li key={d.id}>
            <div className="file-meta">
              <strong>{d.filename}</strong>
              <span>{(d.filesize / 1024).toFixed(2)} KB</span>
            </div>

            <div className="actions">
              <a href={`http://localhost:5000/documents/${d.id}`} target="_blank" rel="noreferrer">Download</a>
              <button className="delete-btn" onClick={() => deleteDoc(d.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
