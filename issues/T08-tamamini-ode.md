# T08 — "Tamamını öde": ilk uçtan uca akış (E4, E5, E6)

**Bloklayan:** T03, T07
**Referans:** PRODUCT.md E4, E5, E6, R1, R8; CONTEXT.md D13, D33

---

## Amaç

**Bu issue projenin dönüm noktasıdır.** Bittiğinde elinde eksik ama **uçtan uca çalışan bir
ürün** olur: QR okut → hesabı gör → öde → masa kapansın.

En basit modla (tamamını öde) başlanıyor; diğer iki mod (T09, T10) bu iskeletin üzerine biner.

---

## Kapsam

- **E4 Ödeme ekranı:** ödenecek tutar + kart formu + "Öde" → 3D Secure
  (bahşiş satırı bu issue'da **yok**, T11'de gelecek)
- T03'te kurulan ödeme katmanı buraya bağlanır
- **E5 Sonuç:** başarılı (makbuz, **kalıcı adres**) / başarısız (hata + tekrar dene)
- **E6 Masa kapandı:** kalan bakiye 0 olunca herkesin ekranı buraya geçer

## Kritik kurallar

- **R8 — Ödeme doğrulaması sunucu tarafındadır.** Pay, ancak sunucu iyzico'dan onay aldıktan
  sonra ödenmiş sayılır. Kullanıcı 3D ekranından hiç dönmese bile pay doğru görünmeli.
- **R1 — Bakiye kuralı.** `Kalan bakiye = güncel toplam − ödenen toplam`. Masa **yalnızca
  kalan bakiye 0 olduğunda** kapanır.
- Masanın kapanması otomatiktir, kimse bir butona basmaz.

---

## Kabul kriterleri

- [ ] İki farklı telefondan aynı masa açılıyor; biri ödeyince diğerinin ekranı ~5 sn içinde
      güncelleniyor
- [ ] Ödeme tamamlanınca masa otomatik kapanıyor ve iki telefon da E6 gösteriyor
- [ ] Makbuz adresi kapatılıp tekrar açıldığında hâlâ çalışıyor
- [ ] Başarısız ödeme sonrası kullanıcı tekrar deneyebiliyor, masa etkilenmiyor
- [ ] **3D ekranında tarayıcı kapatılırsa:** masa yine de doğru şekilde ödenmiş görünüyor
- [ ] Ödeme sırasında kurulum ekranından ürün eklenirse kalan bakiye büyüyor ve masa kapanmıyor
