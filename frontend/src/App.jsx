import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import BookCard from './components/BookCard';
import Loader from './components/Loader';
import styles from './App.module.css';
import { motion as Motion } from 'framer-motion';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setAiSummary('');
    setBooks([]);
    try {
      const res = await axios.post('/api/books/recommend', { query });
      setBooks(res.data.books);
      setAiSummary(res.data.aiSummary);
    } catch {
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Motion.div
      className={`${styles.container} ${darkMode ? styles.dark : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.mainLayout}>
        {/* Left Panel */}
        <div className={styles.leftPane}>
          <Motion.header
            className={styles.header}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.headerTop}>
              <h1 className={styles.title}>📚 Book Recommender</h1>
              <button
                className={styles.themeToggle}
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <p className={styles.tagline}>
              Discover your next favorite read with{' '}
              <span className={styles.ai}>AI-powered</span> suggestions
            </p>
          </Motion.header>

          <Motion.div
            className={styles.searchSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <input
              type="text"
              placeholder="Enter a mood, genre, or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={styles.searchButton}
            >
              <FaSearch />
              <span className={styles.buttonText}>
                {loading ? 'Searching...' : 'Search'}
              </span>
            </button>
          </Motion.div>

          {error && (
            <Motion.p className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </Motion.p>
          )}

          {!loading && books.length === 0 && !error && (
            <Motion.p className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Try entering a mood, genre, or author to get book recommendations.
            </Motion.p>
          )}

          <Motion.footer
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>
              Made with ❤️ by <strong>Tanish Kulkarni</strong> •{' '}
              <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </p>
          </Motion.footer>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPane}>
          {loading && <Loader />}

          {aiSummary && (
            <Motion.section
              className={styles.summarySection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2>Why You Might Like These Books</h2>
              <p className={styles.aiSummary}>{aiSummary}</p>
            </Motion.section>
          )}

          <Motion.section
            className={styles.bookGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {books.map((book, idx) => (
              <BookCard key={idx} book={book} query={query} />
            ))}
          </Motion.section>
        </div>
      </div>
    </Motion.div>
  );
}
