# T12 — Kenar durumlar ve kaçış valfleri

**Bloklayan:** T08
**Referans:** PRODUCT.md R1, R2, R4; CONTEXT.md D20, D21

---

## Amaç

Masanın takılı kalmasına yol açabilecek durumları kapatmak.

## Neden ayrı bir issue

Bunlar tek tek küçük ama **her biri masanın hiç kapanmamasına** yol açabilir. Arkadaş
testinde takılı bir masa, testin kendisini bozar.

---

## Kapsam

**1. "Kalanı ben ödeyeyim"**
Masadaki herhangi biri kalan bakiyenin tamamını üstlenebilir. E1-c'de bir buton.
R2'nin özel hali — ayrı bir hesaplama yazılmamalı.

**2. Bölüşme modu kilidi (R4)**
Mod masa genelinde geçerli; **ilk ödeme gerçekleşene kadar** değiştirilebilir, sonra kilitlenir.
Mod değiştirildiğinde o ana kadarki **ödenmemiş** seçimler temizlenir.

**3. Manuel masa kapatma**
T06'da yapıldı; burada uçtan uca doğrulanır: kalan bakiye > 0 iken masa kapatılabiliyor mu,
kapandığında müşteri ekranları E6'ya geçiyor mu.

**4. Ödeme sırasında adisyon büyümesi**
Ödeme başlamışken kurulum ekranından ürün eklenmesi. Ödenen tutar asla geri alınmaz, kalan
bakiye büyür, masa kapanmaz (R1).

**5. Aynı kişinin ikinci kez ödemesi**
Ödeme yapmış bir oturum "kalanı ben ödeyeyim" ile tekrar ödeyebilmeli.

---

## Kabul kriterleri

- [ ] Kalan bakiye tek seferde ödenebiliyor ve masa kapanıyor
- [ ] İlk ödemeden önce mod değiştirilebiliyor, sonra değiştirilemiyor
- [ ] Mod değişince ödenmemiş seçimler temizleniyor, **ödenmiş olanlar korunuyor**
- [ ] Kalan bakiye > 0 iken masa manuel kapatılabiliyor ve müşteri ekranları E6'ya geçiyor
- [ ] Ödeme sürerken eklenen ürün kalan bakiyeyi doğru büyütüyor
- [ ] Aynı oturum ikinci kez ödeme yapabiliyor
- [ ] **Hiçbir senaryoda masa kapanamaz halde takılı kalmıyor**
