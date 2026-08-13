# T01 — Proje iskeleti ve canlıya alma

**Bloklayan:** T00
**Referans:** PRODUCT.md bölüm 9 (Teknik kısıtlar), CONTEXT.md D29

---

## Amaç

Boş bir Next.js uygulaması, **canlıda ve HTTPS üzerinden erişilebilir** halde olsun.

## Neden en başta

3D Secure geri dönüşü herkese açık bir HTTPS adresi ister. Bu yüzden proje **daha ilk
günden yayında olmak zorunda**; localhost'ta arkadaş testi yapılamaz. Canlıya almayı sona
bırakırsan test edemediğin bir yığın kodun olur.

---

## Kapsam

- Next.js (App Router) + TypeScript projesi kur
- Bu yerel git deposunu GitHub deposuna bağla ve gönder
- Vercel'e bağla, otomatik dağıtımı aç
- `.env.local` dosyası ve `.env.example` şablonu oluştur (T00'daki dört değer için)
- `.gitignore` içinde `.env.local` olduğundan emin ol
- Ana sayfada tek bir satır yazı: "Restoran QR Ödeme — v1"
- Arayüz metinleri için tek bir dosya oluştur (`lib/metinler.ts`) — CONTEXT.md D27 gereği
  metinler koda gömülmeyecek

## Kapsam dışı

Tasarım, veritabanı, ödeme. Sadece iskelet.

---

## Kabul kriterleri

- [ ] `https://<proje>.vercel.app` adresi telefondan açılıyor ve yazıyı gösteriyor
- [ ] `git push` sonrası Vercel otomatik dağıtım yapıyor
- [ ] `.env.local` git'e gitmiyor, `.env.example` gidiyor
- [ ] Metin dosyası mevcut ve ana sayfadaki yazı oradan geliyor
