const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  area_name: { type: String, required: true, minLength: 3, maxLength: 100 },
  state: {
    type: String,
    required: true,
    enum: [
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming',
    ],
    default: 'Alabama',
  },
  added_date: { type: Date, required: true },
  added_by: { type: String, required: true, maxLength: 100 },
});

// Virtual for area's URL
AreaSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/area/${this._id}`;
});

AreaSchema.virtual('added_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added_date).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Area', AreaSchema);
