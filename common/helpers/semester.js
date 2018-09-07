import moment from 'moment';

const currentYear = moment().year();
const currentMonth = moment().month();

export default function semester(username) {
  const eduStartYear = Number(username.substr(0, 4));
  if (currentMonth < 6) {
    let initArray = [];
    for (let i = 2008; i < currentYear; i++) {
      initArray.unshift({
        year: i,
        semester: 1,
      });
      initArray.unshift({
        year: i,
        semester: 2,
      })
    }
    return initArray.slice(0, (currentYear - eduStartYear) * 2);
  } else {
    let initArray = [];
    for (let i = 2008; i < currentYear; i++) {
      initArray.unshift({
        year: i,
        semester: 1,
      });
      initArray.unshift({
        year: i,
        semester: 2,
      })
    }
    initArray.unshift({
      year: currentYear,
      semester: 1,
    });
    return initArray.slice(0, (currentYear - eduStartYear) * 2 + 1);
  }
}
