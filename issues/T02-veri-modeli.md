# T02 — Veri modeli ve şema

**Bloklayan:** T01
**Referans:** PRODUCT.md bölüm 3 (Sözlük), R1-R3, R5-R7, R9

---

## Amaç

Postgres bağlantısı ve v1'in tamamını taşıyacak şema.

## Neden gerçek veritabanı şart

Birden çok telefon aynı masayı paylaşıyor; durum bellekte tutulamaz.

---

## Kapsam

Kavramlar (PRODUCT.md bölüm 3 ile birebir aynı isimlendirme kullanılacak):

- **Masa** — kalıcı, **tahmin edilemez rastgele token** taşır (R9; "masa-7" gibi tahmin
  edilebilir değer yasak)
- **Adisyon** — bir masaya ait, açık/kapalı durumu olan hesap; bölüşme modu ve (eşit bölmede)
  kişi sayısı burada tutulur
- **Adisyon kalemi** — ürün adı ve fiyat. **Her adet ayrı ayrı seçilebilir olmalı** (R6):
  "2x Köfte" iki ayrı seçilebilir birim gibi davranır
- **Oturum** — bir telefonun anonim tarayıcı oturumu. Kimlik değil, isim yok (R10).
  Son görülme zamanı tutulur (R7 için)
- **Ödeme** — **iki ayrı tutar**: hesaba giden tutar ve bahşiş (R3). Durumu: beklemede /
  başarılı / başarısız
- **Kalem kilidi** — hangi adedin hangi oturum tarafından tutulduğu ve ödenip ödenmediği

Ayrıca:
- Tüm tutarlar **kuruş hassasiyetinde tam sayı** olarak tutulsun (ondalık kayan sayı yok)
- Migration/şema yönetimi kurulsun
- Demo menüsü için sabit ürün listesi (~20 ürün) tohum verisi olarak eklensin

## Kapsam dışı

Arayüz, iş mantığı. Sadece şema ve bağlantı.

---

## Kabul kriterleri

- [ ] Uygulama canlı ortamda veritabanına bağlanabiliyor
- [ ] Yukarıdaki tüm kavramlar şemada karşılığını buluyor
- [ ] Bir ödemenin hesap tutarı ile bahşişi **ayrı iki alanda** duruyor
- [ ] Tutarlar kuruş cinsinden tam sayı
- [ ] Demo menüsü veritabanında
- [ ] Masa token'ı tahmin edilemez (rastgele üretiliyor)
