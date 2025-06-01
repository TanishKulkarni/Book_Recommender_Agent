import { useState } from 'react';
import styles from '../BookCard.module.css';

export default function BookCard({ book, query }) {  // <-- query prop expected here
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const coverUrl = book.cover_id
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
    : null;

  const handleBookmark = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/books/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, book }),  // send both query and book to backend
      });
      const data = await response.json();
      if (response.ok) {
        setSaved(true);
        alert(data.message);
      } else {
        alert(data.error || 'Failed to save the book.');
      }
    } catch (error) {
      alert('Error saving the book.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.card}>
      {coverUrl ? (
        <img src={coverUrl} alt={`${book.title} cover`} className={styles.cover} />
      ) : (
        <div className={styles.noCover}>No Cover</div>
      )}
      <h3 className={styles.title}>{book.title}</h3>
      <p className={styles.authors}>{book.authors.join(', ')}</p>
      <p className={styles.publishYear}>Published: {book.publish_year}</p>
      <a
        href={book.openlibrary_url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.moreInfo}
      >
        More Info
      </a>

      <button
        className={styles.bookmarkButton}
        onClick={handleBookmark}
        disabled={saving || saved}
      >
        {saved ? 'Bookmarked' : saving ? 'Saving...' : 'Bookmark'}
      </button>
    </div>
  );
}
