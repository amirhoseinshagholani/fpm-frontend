import moment from 'moment-jalaali';

export default function toJalaliDate(date: string): string {
    return moment(date).format('jYYYY/jMM/jDD');
}