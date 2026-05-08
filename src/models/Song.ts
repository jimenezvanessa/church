import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['hymnal', 'praise'],
    default: 'hymnal',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Song || mongoose.model('Song', SongSchema);