const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  route_name: { type: Schema.Types.ObjectId, ref: 'Routename', required: true },
  comment_text: { type: String, required: true, maxLength: 144 },
  added_date: { type: Date, required: true },
  added_by: { type: String, required: true, maxLength: 100 },
});

// Virtual for area's URL
CommentSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/comment/${this._id}`;
});

CommentSchema.virtual('added_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Comment', CommentSchema);
