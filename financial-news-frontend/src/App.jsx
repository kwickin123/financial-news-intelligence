import { useEffect, useState } from "react";
import { fetchArticles, createArticle } from "./api";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetchArticles();
      setArticles(res.data.articles || []);
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      await createArticle({
        title,
        source,
        content,
      });

      // clear inputs
      setTitle("");
      setSource("");
      setContent("");

      // reload list
      await loadArticles();
    } catch (err) {
      console.error(err);
      alert("Failed to submit article");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>
      <h1>Financial News Intelligence v0.1</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <textarea
          placeholder="Full article content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit">Submit Article</button>
      </form>

      <hr />

      <h2>Articles</h2>
      {loading && <p>Loading...</p>}
      {!loading &&
        articles.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ccc",
              padding: "0.75rem",
              borderRadius: "4px",
              marginBottom: "0.75rem",
            }}
          >
            <h3>{a.title}</h3>
            <p>
              <strong>Source:</strong> {a.source || "N/A"} —{" "}
              <strong>Created:</strong> {a.created_at}
            </p>
            <strong>Summary:</strong>
            <p>{a.summary}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
