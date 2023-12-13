const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  area_name: { type: String, required: true, maxLength: 100 },
  state: { type: String, required: true, maxLength: 100 },
  added_date: { type: Date, required: true },
  added_by: { type: String, required: true, maxLength: 100 },
});

// Virtual for area's URL
AreaSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/area/${this._id}`;
});

AreaSchema.virtual('added_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Area', AreaSchema);
