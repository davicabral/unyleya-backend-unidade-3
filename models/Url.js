import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});
  
  export default mongoose.model('Url', UrlSchema);