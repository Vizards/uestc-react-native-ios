import moment from 'moment';

const year = moment().month() < 8 ? moment().year() - 1 : moment().year();
const semester = moment().month() < 8 ? 2 : 1;

module.exports = {year, semester};
