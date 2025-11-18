import { useEffect, useState } from "react";
import { fetchArticles, createArticle } from "./api";

const truncate = (text, max = 200) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "..." : text;
};

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // NEW: tagging state
  const [assetClass, setAssetClass] = useState("");
  const [sentiment, setSentiment] = useState("");

  const loadArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchArticles();
      setArticles(res.data.articles || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load articles.");
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
      alert("Title and content are required.");
      return;
    }

    try {
      setSubmitting(true);
      await createArticle({
        title: title.trim(),
        source: source.trim(),
        content: content.trim(),
        asset_class: assetClass, // send to backend
        sentiment: sentiment,    // send to backend
      });

      setTitle("");
      setSource("");
      setContent("");
      setAssetClass("");
      setSentiment("");

      await loadArticles();
    } catch (err) {
      console.error(err);
      alert("Failed to submit article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
  };

  // filtered list based on search term
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredArticles = articles.filter((a) => {
    if (!normalizedSearch) return true;
    const haystack = (
      (a.title || "") +
      " " +
      (a.source || "") +
      " " +
      (a.summary || "")
    ).toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "2rem 1.5rem 3rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
        Financial News Intelligence v0.1
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#bbbbbb" }}>
        Paste financial news, save it, and review concise summaries from your
        own full-stack system.
      </p>

      {/* Form card */}
      <div
        style={{
          background: "#1f1f1f",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          Add New Article
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label style={{ fontSize: "0.9rem" }}>Title *</label>
            <input
              type="text"
              placeholder="e.g. US stocks rise as inflation cools"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                background: "#121212",
                color: "#f5f5f5",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label style={{ fontSize: "0.9rem" }}>Source</label>
            <input
              type="text"
              placeholder="e.g. Reuters, Bloomberg"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                background: "#121212",
                color: "#f5f5f5",
              }}
            />
          </div>

          {/* NEW: Asset class */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label style={{ fontSize: "0.9rem" }}>Asset Class</label>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                background: "#121212",
                color: "#f5f5f5",
              }}
            >
              <option value="">Select asset class</option>
              <option value="equity">Equity</option>
              <option value="fx">FX / Currencies</option>
              <option value="crypto">Crypto</option>
              <option value="commodities">Commodities</option>
              <option value="macro">Macro / Rates</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* NEW: Sentiment */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label style={{ fontSize: "0.9rem" }}>Sentiment</label>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                background: "#121212",
                color: "#f5f5f5",
              }}
            >
              <option value="">Select sentiment</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label style={{ fontSize: "0.9rem" }}>Full article content *</label>
            <textarea
              placeholder="Paste the full article text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                background: "#121212",
                color: "#f5f5f5",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "0.5rem",
              alignSelf: "flex-start",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: submitting ? "default" : "pointer",
              background: submitting ? "#555" : "#4f46e5",
              color: "#f9fafb",
            }}
          >
            {submitting ? "Submitting..." : "Submit Article"}
          </button>
        </form>
      </div>

      {/* Search + Articles list */}
      <div>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
            Articles
          </h2>
          <input
            type="text"
            placeholder="Search by title, source, or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              background: "#111827",
              color: "#f5f5f5",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "#f97373" }}>{error}</p>}

        {!loading && !error && filteredArticles.length === 0 && (
          <p style={{ color: "#aaaaaa" }}>
            No articles match your search. Try a different keyword.
          </p>
        )}

        {!loading &&
          filteredArticles.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#141414",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                marginBottom: "0.85rem",
                border: "1px solid #333",
                cursor: "pointer",
              }}
              onClick={() => handleSelectArticle(a)}
            >
              <h3 style={{ marginBottom: "0.35rem", fontSize: "1.05rem" }}>
                {a.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  marginBottom: "0.25rem",
                  color: "#bbbbbb",
                }}
              >
                <strong>Source:</strong> {a.source || "N/A"}{" "}
                <span style={{ marginLeft: "0.75rem" }}>
                  <strong>Created:</strong> {a.created_at}
                </span>
              </p>

              {/* NEW: Show asset + sentiment */}
              <p
                style={{
                  fontSize: "0.8rem",
                  marginBottom: "0.4rem",
                  color: "#a1a1aa",
                }}
              >
                {a.asset_class && (
                  <span style={{ marginRight: "0.75rem" }}>
                    <strong>Asset:</strong> {a.asset_class}
                  </span>
                )}
                {a.sentiment && (
                  <span>
                    <strong>Sentiment:</strong> {a.sentiment}
                  </span>
                )}
              </p>

              <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                <strong>Summary: </strong>
                {truncate(a.summary, 200)}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: "0.25rem",
                  color: "#888",
                }}
              >
                Click to view full article
              </p>
            </div>
          ))}
      </div>

      {/* Full article view */}
      {selectedArticle && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #4b5563",
            background: "#111827",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
              {selectedArticle.title}
            </h2>
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Close
            </button>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
              color: "#9ca3af",
            }}
          >
            <strong>Source:</strong> {selectedArticle.source || "N/A"}{" "}
            <span style={{ marginLeft: "0.75rem" }}>
              <strong>Created:</strong> {selectedArticle.created_at}
            </span>
            {(selectedArticle.asset_class || selectedArticle.sentiment) && (
              <span style={{ marginLeft: "0.75rem" }}>
                {selectedArticle.asset_class && (
                  <>
                    <strong>Asset:</strong> {selectedArticle.asset_class}{" "}
                  </>
                )}
                {selectedArticle.sentiment && (
                  <>
                    <strong>Sentiment:</strong> {selectedArticle.sentiment}
                  </>
                )}
              </span>
            )}
          </p>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Summary:</strong>
            <p style={{ marginTop: "0.25rem", lineHeight: 1.5 }}>
              {selectedArticle.summary}
            </p>
          </div>
          <div>
            <strong>Full Article:</strong>
            <p
              style={{
                marginTop: "0.25rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
