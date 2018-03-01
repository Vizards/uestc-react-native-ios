import moment from 'moment';

const currentYear = moment().year();
const currentMonth = moment().month();
if (currentMonth < 6) {
  module.exports = [
    { year: currentYear - 1, semester: 2 },
    { year: currentYear - 1, semester: 1 },
    { year: currentYear - 2, semester: 2 },
    { year: currentYear - 2, semester: 1 },
    { year: currentYear - 3, semester: 2 },
    { year: currentYear - 3, semester: 1 },
    { year: currentYear - 4, semester: 2 },
    { year: currentYear - 4, semester: 1 },

  ]
} else {
  module.exports = [
    { year: currentYear, semester: 1 },
    { year: currentYear - 1, semester: 2 },
    { year: currentYear - 1, semester: 1 },
    { year: currentYear - 2, semester: 2 },
    { year: currentYear - 2, semester: 1 },
    { year: currentYear - 3, semester: 2 },
    { year: currentYear - 3, semester: 1 },
  ]
}
