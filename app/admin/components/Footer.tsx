'use client';
import { useEffect, useState } from 'react';

const quotes = [
  { text: "آنچه را که در جستجوی آن هستی، در درون خودت بجوی.", author: "مولانا" },
  { text: "دانش اگر در ثریا باشد، مردانی از سرزمین پارس به آن دست خواهند یافت.", author: "حضرت محمد (ص)" },
  { text: "به جای نفرین به تاریکی، شمعی بیفروز.", author: "کنفوسیوس" },
  { text: "با دیگران همان‌گونه رفتار کن که دوست داری با تو رفتار شود.", author: "زرین‌قانون" },
  { text: "جهان را نگاهت می‌سازد، نه آنچه می‌بینی.", author: "سعدی" },
  { text: "بهترین انتقام، موفقیت است.", author: "افلاطون" },
  { text: "هر کس خود را شناخت، خدا را شناخته است.", author: "امام علی (ع)" },
  { text: "اندیشه‌ات را عوض کن تا زندگی‌ات تغییر کند.", author: "نورمن وینسنت پیل" },
  { text: "کسی که امید را از دست بدهد، همه چیز را از دست داده است.", author: "حضرت علی (ع)" },
  { text: "در سختی‌هاست که شخصیت انسان شکل می‌گیرد.", author: "گوته" },
  { text: "زندگی صحنه یکتای هنرمندی ماست.", author: "فروغ فرخزاد" },
  { text: "آن‌کس که زیبایی را می‌بیند، خود نیز زیباست.", author: "حافظ" },
  { text: "خودت را دوست بدار، دیگران هم خواهند داشت.", author: "رومی" },
  { text: "امید، نخستین گام در راه پیروزی است.", author: "ناپلئون بناپارت" },
  { text: "خرد، دارایی‌ای است که هیچ دزدی نمی‌تواند آن را برباید.", author: "سقراط" },
  { text: "آن‌چه ما را نمی‌کُشد، ما را قوی‌تر می‌سازد.", author: "نیچه" },
  { text: "زمانی که یاد گرفتی ببخشی، قدرتمندتر خواهی شد.", author: "بودا" },
  { text: "علم بدون عمل، دیوانگی است.", author: "ابن‌سینا" },
  { text: "هیچ‌گاه امید را از دست مده، شاید فردا روز تو باشد.", author: "کوروش کبیر" },
  { text: "اگر می‌خواهی خوشبخت باشی، از درون آغاز کن.", author: "لائوتسه" },
];

export default function Footer() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  if (!quote) return null;

  return (
    <footer className="bg-blue-400 text-black font-vazir-medium text-sm text-center p-3 rounded-t-2xl">
      <p className="">“{quote.text}”</p>
      <p className="mt-2 text-xs"> {quote.author}</p>
    </footer>
  );
}
