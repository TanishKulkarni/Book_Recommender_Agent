import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    query: String,
    result: [
        {
            title: String,
            authors: [String],
            publish_year: Number,
            cover_id: Number,
            description: String,
            openlibrary_url: String
        }
    ],
    aiSummary: String,
    timestamp: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
