const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const RoutenameSchema = new Schema({
  route_name: { type: String, required: true, maxLength: 100 },
  route_type: {
    type: String,
    required: true,
    enum: ['Traditional', 'Sport'],
    default: 'Sport',
  },
  route_grade: {
    type: String,
    required: true,
    enum: [
      '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a',
      '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c',
      '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a',
      '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c',
      '5.14d', '5.15a', '5.15b', '5.15c', '5.15d'],
    default: '5.4',
  },
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  sector: { type: Schema.Types.ObjectId, ref: 'Sector', required: true },
  added_date: { type: Date, required: true },
  added_by: { type: String, required: true, maxLength: 100 },
});

// Virtual for area's URL
RoutenameSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/routename/${this._id}`;
});

RoutenameSchema.virtual('added_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added_date).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Routename', RoutenameSchema);
