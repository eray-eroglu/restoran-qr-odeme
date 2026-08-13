# T03 — Ödeme dikey dilimi (en riskli parça)

**Bloklayan:** T01
**Referans:** PRODUCT.md R8, bölüm 9; CONTEXT.md D30, D33

---

## Amaç

Canlı ortamda, iyzico sandbox üzerinden **tek bir ödemeyi 3D Secure dahil uçtan uca**
tamamlamak ve sonucu **sunucu tarafında doğrulamak.**

## Neden bu kadar erken

Projenin en riskli parçası budur. Burada bir engel çıkarsa (3DS geri dönüşü, sandbox
davranışı, kart formu kısıtları) planın tamamı değişir. Bunu **altıncı haftada değil, ilk
haftada** öğrenmek gerekir. Bu yüzden veri modelinden bile önce geliyor.

Bu bir **dikey dilim**: tasarım yok, ekran güzelliği yok, veritabanı bile şart değil —
sadece akış çalışsın.

---

## Kapsam

- Çıplak bir test sayfası: sabit **1,00 TL** tutar ve bir "Öde" butonu
- iyzico sandbox ile ödeme başlatma
- 3D Secure sayfasına yönlendirme ve geri dönüş adresinin işlenmesi
- **Sunucu tarafında doğrulama:** geri dönüşte tarayıcının söylediğine güvenilmez; sunucu
  ödeme durumunu doğrudan iyzico'ya sorarak teyit eder (R8)
- Sonucu ekranda göster: başarılı / başarısız
- Ödeme entegrasyonunun tamamı **tek bir dosyanın/katmanın arkasında** dursun; sağlayıcı
  değişirse tek yer değişsin (CONTEXT.md D30)

## Kapsam dışı

Masa, adisyon, pay, bahşiş, tasarım. Hiçbiri.

---

## Kabul kriterleri

- [ ] Canlı adreste, gerçek bir telefondan, test kartıyla 1,00 TL'lik ödeme tamamlanıyor
- [ ] 3D Secure ekranı görünüyor ve geri dönüş doğru işleniyor
- [ ] Ödeme sonucu **sunucunun iyzico'ya sorması** ile belirleniyor (tarayıcıdan gelen
      bilgiyle değil)
- [ ] Kullanıcı 3D ekranında tarayıcıyı kapatsa bile, sunucu sorulduğunda ödemenin gerçek
      durumunu doğru raporluyor
- [ ] Başarısız ödeme (yanlış test kartı) düzgün hata veriyor
- [ ] iyzico'ya dokunan tüm kod tek bir katmanda toplanmış
