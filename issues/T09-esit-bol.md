# T09 — Eşit böl (E2)

**Bloklayan:** T08
**Referans:** PRODUCT.md E2, R2, R5

---

## Amaç

Hesabı kişi sayısına eşit bölerek ödeme.

---

## Kapsam

- **E2 Kişi sayısı ekranı:** yalnızca "Eşit böl" seçildiğinde ve **yalnızca ilk kişiye**
  gösterilir. Tek soru: "Masada kaç kişisiniz?"
- Kişi sayısı masaya sabitlenir; **ilk ödemeden sonra değiştirilemez** (R5)
- Sonraki kişiler bu ekranı hiç görmez, doğrudan "Payımı öde" görür
- E1-c'de ilerleme: "3 payın 2'si ödendi · kalan 160,00 TL"

## Kritik kural — R2 (pay hesabı)

> **Bir ödemenin tutarı = kalan bakiye ÷ kalan ödenmemiş pay sayısı (kuruşa yuvarlanır).
> Son kalan pay, kalan bakiyenin tamamıdır.**

Bu tek kural üç şeyi birden çözer:
- **Kuruş artığı:** 100,00 TL ÷ 3 → 33,33 / 33,33 / **33,34**. Masa mutlaka 0'a iner.
- **Adisyon büyümesi:** ödeme sürerken ürün eklenirse kalan paylar kendiliğinden yeniden hesaplanır.
- **"Kalanı ben ödeyeyim":** bu kuralın özel hali.

Sistem **kimin ödediğini bilmez**, sadece **kaç payın ödendiğini sayar** (R5, R10).

---

## Kabul kriterleri

- [ ] İlk kişi kişi sayısını giriyor, ikinci kişi bu ekranı görmüyor
- [ ] İlk ödemeden sonra kişi sayısı değiştirilemiyor
- [ ] **100,00 TL / 3 kişi testi:** üç ödeme sonunda kalan bakiye tam olarak 0,00 ve masa kapanıyor
- [ ] Bir kişi ödedikten sonra kurulum ekranından ürün eklenince, kalan payların tutarı
      doğru şekilde artıyor
- [ ] İlerleme göstergesi doğru sayıyor
