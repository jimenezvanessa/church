import mongoose from 'mongoose';

const PresentationSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slides: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Presentation || mongoose.model('Presentation', PresentationSchema);