# T11 — Bahşiş ve makbuz

**Bloklayan:** T08
**Referans:** PRODUCT.md E4, E5, R3; CONTEXT.md D22, D23, D32

---

## Amaç

Ödeme ekranına bahşiş satırını ve makbuza iki ayrı tutarı eklemek.

---

## Kapsam

**Bahşiş (E4):**
- Ödeme ekranında **tek satır**: %5 / %10 / %15 / Yok
- Varsayılan **seçili değil**, atlanabilir
- **Ayrı ekran değil**, ayrı adım değil
- Seçilince toplam anında güncellenir
- Ekranda iki sayı ayrı ayrı görünür: **hesap payı** ve **bahşiş**

**Makbuz (E5):**
- Ödenen tutar, bahşiş, tarih/saat, masa
- Adresi **kalıcı**
- Altında masanın güncel durumu ("kalan 160,00 TL") ve hesap ekranına dönüş
- **Bu bir makbuzdur, fiş değildir** — ekranda anlaşılır olmalı. Yasal fiş restoranın kendi
  cihazından kesilir.

## Kritik kural — R3

> **Bahşiş bakiyeden bağımsızdır.** Kalan bakiyeden **yalnızca hesaba giden tutar** düşülür.
> Masanın kapanması bahşişe bakmaz.

Bu kural kırılırsa hesap eksik kapanır ve restoran parasını alamaz.

---

## Kabul kriterleri

- [ ] %10 bahşişle ödeme yapıldığında kalan bakiyeden **sadece hesap payı** düşüyor
- [ ] Bahşişsiz ödeme sorunsuz çalışıyor (varsayılan hâli)
- [ ] Makbuzda hesap payı ve bahşiş ayrı ayrı görünüyor
- [ ] Kurulum ekranındaki ödeme dökümünde de ayrı görünüyor (T06)
- [ ] Makbuz adresi kapatılıp tekrar açıldığında çalışıyor
- [ ] "Fiş değildir" bilgisi ekranda mevcut
- [ ] Bahşiş satırı ödeme akışına ek bir adım getirmiyor
