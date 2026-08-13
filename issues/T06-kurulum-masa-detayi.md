# T06 — Kurulum: masa detayı (E9)

**Bloklayan:** T05
**Referans:** PRODUCT.md E9, R1, R3, R9; CONTEXT.md D21

---

## Amaç

Bir masanın adisyonunu kurmak, ödemeye açmak, QR'ını almak ve gerekirse manuel kapatmak.

---

## Kapsam

- Demo menüsünden **tıklayarak** ürün ekleme ve çıkarma (T02'deki ~20 ürünlük sabit menü)
- Masanın güncel adisyonu ve toplamı
- **"Ödemeye aç"** — masa bu andan itibaren QR üzerinden görünür hale gelir (R9)
- **QR linkini göster** — hem adres olarak hem de ekranda okutulabilir bir QR görseli olarak
  (arkadaş testinde masaya kâğıt yapıştırmak yerine ekrandan okutacaksın)
- **Ödeme dökümü** — her ödeme için **hesap payı ve bahşiş ayrı ayrı** (R3)
- **"Masayı manuel kapat"** — kaçış valfi: kalan bakiye başka yolla tahsil edilmiş sayılır ve
  masa kapanır. Onay sorulmalı (geri alınamaz)

## Önemli kural

Adisyon, ödeme başladıktan **sonra da** büyüyebilir (R1). Bu ekran buna izin vermeli; ödeme
başladı diye ürün ekleme kapanmamalı.

---

## Kabul kriterleri

- [ ] Menüden tıklayarak ürün ekleniyor/çıkarılıyor, toplam anında güncelleniyor
- [ ] "Ödemeye aç" sonrası QR linki çalışıyor ve müşteri tarafını açıyor
- [ ] QR görseli ekranda okutulabiliyor
- [ ] Ödeme başlamışken de ürün eklenebiliyor, kalan bakiye doğru büyüyor
- [ ] Manuel kapatma çalışıyor ve onay soruyor
- [ ] Ödeme dökümünde hesap payı ile bahşiş ayrı görünüyor
