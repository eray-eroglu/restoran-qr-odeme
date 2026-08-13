# T10 — Ürün seçme ve kilitleme (E3)

**Bloklayan:** T08
**Referans:** PRODUCT.md E3, R6, R7; CONTEXT.md D12, D24, D25

---

## Amaç

Kullanıcının kendi yiyip içtiği ürünleri seçerek payını ödemesi. **v1'in en karmaşık parçası
ve ürünün asıl farklılaştığı yer** — bu yüzden en sona bırakıldı.

---

## Kapsam

- Adisyondaki **her adet ayrı ayrı** seçilebilir ("2x Köfte" iki ayrı satır gibi davranır)
- Her adedin üç hali, **bir bakışta ayrılacak şekilde**:
  - **Seçilebilir**
  - **Başkası seçmiş (kilitli)** — isim gösterilmez, sadece "seçildi" (R10)
  - **Ödenmiş** — kalıcı olarak kapalı
- Altta canlı toplam ve "Öde" butonu
- Seçim istediği zaman geri alınabilir
- Bu ekranda yenileme daha sık: **~1,5 sn** (D24)

## Kritik kurallar

- **R6 — Kilidin sahibi sunucudur.** Arayüz iyimser davranır (kendi hareketin anında görünür),
  ama gerçek kilit sunucudadır. Sunucu ikinci seçimi reddederse: *"Bu ürünü az önce başkası
  seçti."* — **hata gibi değil, yumuşak bilgi olarak** gösterilir. Bu normal bir durumdur.
- **R7 — Sessizleşen oturumun kilidi düşer.** Bir telefon ~60 saniye sunucuya hiç uğramazsa
  o oturumun **ödenmemiş** seçimleri serbest bırakılır. **Ödenmiş** seçimler asla serbest kalmaz.

---

## Kabul kriterleri

- [ ] İki telefonda aynı masa açık; biri ürün seçince diğerinde ~1,5 sn içinde kilitli görünüyor
- [ ] İki telefon **aynı anda** aynı adede dokunduğunda ikincisi yumuşak uyarı alıyor ve
      ürün tek kişiye gidiyor
- [ ] Seçim geri alınabiliyor, ürün diğerlerinde tekrar seçilebilir oluyor
- [ ] Bir telefon sayfayı kapatınca ~60 sn sonra seçimleri serbest kalıyor
- [ ] Ödenmiş ürünler hiçbir koşulda serbest kalmıyor
- [ ] Herkes kendi ürünlerini ödediğinde kalan bakiye 0 oluyor ve masa kapanıyor
- [ ] Üç hal (seçilebilir/kilitli/ödenmiş) görsel olarak birbirinden net ayrılıyor
