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
  { text: "تنها چیزی که باید از آن بترسیم، خود ترس است.", author: "فرانکلین روزولت" },
  { text: "زندگی امتحانی نیست که پس از آن نمره‌ بدهند؛ خود زندگی پاداش است.", author: "الن واتس" },
  { text: "من فکر می‌کنم، پس هستم.", author: "رنه دکارت" },
  { text: "تنها دانستن کافی نیست، باید به کار بست؛ خواستن کافی نیست، باید عمل کرد.", author: "گوته" },
  { text: "راز تغییر، تمرکز تمام انرژی‌ات روی ساختن چیز جدید است، نه جنگیدن با قدیم.", author: "سقراط" },
  { text: "فقط دو چیز بی‌نهایت‌اند: جهان و حماقت انسان؛ گرچه در مورد اول مطمئن نیستم.", author: "آلبرت اینشتین" },
  { text: "بیشتر مردم نه زندگی می‌کنند، نه می‌میرند؛ فقط وجود دارند.", author: "اسکار وایلد" },
  { text: "نبوغ، یک درصد الهام و نود و نه درصد تلاش است.", author: "توماس ادیسون" },
  { text: "موفقیت حاصل رفتن از شکستی به شکست دیگر است، بدون از دست دادن اشتیاق.", author: "وینستون چرچیل" },
  { text: "آینده به کسانی تعلق دارد که زیبایی رویاهای خود را باور دارند.", author: "الئانور روزولت" },
  { text: "اگر می‌خواهی دنیا را تغییر دهی، خودت را تغییر بده.", author: "ماهاتما گاندی" },
  { text: "آرامش نه در نبود مشکل، بلکه در توانایی کنار آمدن با آن‌هاست.", author: "اپیکتتوس" },
  { text: "آزادی زمانی معنا دارد که شامل آزادی اشتباه کردن هم باشد.", author: "مهاتما گاندی" },
  { text: "هیچ چیز را به‌راحتی نپذیر؛ حتی حرف من را.", author: "بودا" },
  { text: "تمام زندگی، آزمایش و تجربه است؛ هرچه بیشتر تجربه کنی، بهتر خواهی شد.", author: "رالف والدو امرسون" },
  { text: "آنکه خود را می‌شناسد، همه چیز را خواهد شناخت.", author: "مثل یونانی" },
  { text: "هر که چرایی برای زیستن داشته باشد، با هر چگونه‌ای خواهد ساخت.", author: "نیچه" },
  { text: "شجاعت، مقاومت در برابر ترس است، نه نبود آن.", author: "مارک تواین" },
  { text: "هیچ حقیقتی نمی‌تواند بدون تردید دوام آورد.", author: "کارل پوپر" },
  { text: "آموزش سلاحی است که می‌توان با آن دنیا را تغییر داد.", author: "نلسون ماندلا" },
  { text: "دانش قدرت است.", author: "فرانسیس بیکن" },
  { text: "اگر نتوانی آن را ساده توضیح دهی، به‌خوبی آن را نفهمیده‌ای.", author: "آلبرت اینشتین" },
  { text: "بزرگی انسان به خواسته‌هایش نیست، به آن چیزی است که از آن چشم‌پوشی می‌کند.", author: "افلاطون" },
  { text: "تنها سرمایه‌ای که از بین نمی‌رود، دانش است.", author: "ابوریحان بیرونی" },
  { text: "هر آنچه فکر می‌کنی، تبدیل به واقعیت خواهد شد.", author: "بودا" },
  { text: "زندگی کوتاه است، اما هنر جاودانه است.", author: "هیپوکراتس" },
  { text: "انسان همان چیزی است که به آن باور دارد.", author: "آنتوان دو سنت‌اگزوپری" },
  { text: "باور کن که می‌توانی، و نیمی از راه را پیموده‌ای.", author: "تئودور روزولت" },
  { text: "آنچه را که می‌خواهی ببینی، خودت باش.", author: "گاندی" },
  { text: "هر کتاب، یک ذهن است که می‌توان با آن سخن گفت.", author: "امرسون" },
  { text: "آرامش از درون می‌آید، آن را در بیرون جستجو نکن.", author: "بودا" },
  { text: "درخواست نکن آسان‌تر باشد، بخواه قوی‌تر شوی.", author: "جیم ران" },
  { text: "بزرگ‌ترین لذت در زندگی انجام کاری است که دیگران می‌گویند نمی‌توانی انجام دهی.", author: "والتر بیجوت" },
  { text: "فلسفه آغاز دانایی نیست، بلکه عشق به دانایی است.", author: "افلاطون" },
  { text: "آنچه را که نمی‌توانی اندازه بگیری، نمی‌توانی مدیریت کنی.", author: "پیتر دراکر" },
  { text: "هدف از زندگی، شاد بودن است.", author: "دالایی لاما" },
  { text: "ساده زندگی کن تا بتوانی عمیق فکر کنی.", author: "سقراط" },
  { text: "هیچ راهی برای خوشبختی وجود ندارد؛ خوشبختی خود راه است.", author: "بودا" },
  { text: "زندگی‌ای که بررسی نشده باشد، ارزش زیستن ندارد.", author: "سقراط" },
  { text: "دشوارترین چیز، شناخت خود است؛ آسان‌ترین چیز، نصیحت دادن به دیگران.", author: "تالس" },
  { text: "خوشبختی زمانی است که آنچه فکر می‌کنی، می‌گویی و انجام می‌دهی هماهنگ باشند.", author: "گاندی" },
  { text: "جهان به‌اندازه رؤیاهایی است که در سر داری.", author: "ویلیام جیمز" },
  { text: "همیشه حقیقت را بگو، حتی اگر صدایت بلرزد.", author: "مگی کان" },
  { text: "برای رسیدن به مقصد، باید حرکت کرد.", author: "ناشناس (الهام‌گرفته از رومی)" },
  { text: "یادگیری گنجی است که صاحبش را در همه‌جا دنبال می‌کند.", author: "ضرب‌المثل چینی" },
  { text: "انسان آزاد آفریده شده، اما همه جا در زنجیر است.", author: "ژان ژاک روسو" },
  { text: "وقتی هدف را بدانی، راه را خواهی یافت.", author: "لائوتسه" },
  { text: "مهم نیست که چقدر آهسته می‌روی، تا زمانی که متوقف نشوی.", author: "کنفوسیوس" },
  { text: "زمانی که نمی‌توانی مسیر را تغییر دهی، نگرش خود را تغییر بده.", author: "ویکتور فرانکل" }
];

export default function Footer() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  if (!quote) return null;

  return (
    <footer className="bg-yellow-400 text-black font-vazir-medium text-sm text-center p-3 rounded-t-2xl">
      <p className="">“{quote.text}”</p>
      <p className="mt-2 text-xs"> {quote.author}</p>
    </footer>
  );
}
