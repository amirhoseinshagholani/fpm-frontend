/**
 * تبدیل تاریخ میلادی (Gregorian) به شمسی (Jalali)
 * @param gDate - تاریخ میلادی (Date یا string به فرمت ISO)
 * @returns "YYYY/MM/DD"
 */
export function gregorianToJalali(gDate: Date | string): string {
  let gy: number, gm: number, gd: number;

  if (typeof gDate === "string") {
    const [y, m, d] = gDate.split("T")[0].split("-").map(Number);
    gy = y; gm = m; gd = d;
  } else {
    gy = gDate.getUTCFullYear();
    gm = gDate.getUTCMonth() + 1;
    gd = gDate.getUTCDate();
  }

  const g_d_m = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd;
  for (let i = 0; i < gm; ++i) {
    days += g_d_m[i];
  }

  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}
