const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const SectorSchema = new Schema({
  sector_name: { type: String, required: true, maxLength: 100 },
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  added_date: { type: Date, required: true },
  added_by: { type: String, required: true, maxLength: 100 },
});

// Virtual for area's URL
SectorSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/sector/${this._id}`;
});

SectorSchema.virtual('added_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added_date).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Sector', SectorSchema);
