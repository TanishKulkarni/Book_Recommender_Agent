import { getBookSummary } from '../services/groqService.js';
import Book from '../models/book.js';
import axios from 'axios';

export const recommendBooks = async (req, res) => {
  const { query } = req.body; // mood, genre, or author from frontend

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    // Call Open Library API to search books
    const olResponse = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);

    // Map API response to your book format
    const books = olResponse.data.docs.map(book => ({
      title: book.title,
      authors: book.author_name || [],
      publish_year: book.first_publish_year || "Unknown",
      cover_id: book.cover_i || null,
      description: "No description available", // you could improve by fetching more details
      openlibrary_url: `https://openlibrary.org${book.key}`,
    }));

    // Compose prompt for AI summary
    const prompt = `Suggest why someone who likes "${query}" might enjoy these books: ${books.map(b => b.title).join(", ")}. Give a short summary.`;

    // Get AI-generated summary using Groq SDK service
    const aiSummary = await getBookSummary(prompt);

    res.json({ books, aiSummary });
  } catch (error) {
    console.error("Error in recommendBooks:", error);
    res.status(500).json({ error: "Failed to get book recommendations." });
  }
};

export const saveBook = async (req, res) => {
  const { query, book } = req.body;

  if (!query || !book) {
    return res.status(400).json({ error: 'Query and book data are required.' });
  }

  try {
    let existingEntry = await Book.findOne({ query });

    if (existingEntry) {
      const alreadySaved = existingEntry.result.some(b => b.title === book.title);
      if (!alreadySaved) {
        existingEntry.result.push(book);
        await existingEntry.save();
      }
      return res.status(200).json({ message: 'Book added to existing query.' });
    }

    const newBookEntry = new Book({
      query,
      result: [book],
      aiSummary: '',
    });

    await newBookEntry.save();

    res.status(201).json({ message: 'Book saved successfully.' });
  } catch (error) {
    console.error('Error saving book:', error);  // <- full error logged here
    res.status(500).json({ error: 'Failed to save book.' });
  }
};

