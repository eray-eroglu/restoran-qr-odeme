# T07 — Hesap ekranı ve yenileme (E1)

**Bloklayan:** T02, T06
**Referans:** PRODUCT.md E1 (üç durumu), R1, R4, R9, R10; CONTEXT.md D24
**Tasarım:** E1 wireframe'i

---

## Amaç

QR okutulunca açılan ana müşteri ekranı. Ürünün kalbi.

---

## Kapsam

`/m/<token>` adresi, üç durumu ayrı ayrı:

- **E1-a — Açık hesap yok:** "Bu masada şu anda açık bir hesap yok." Başka hiçbir şey yok.
- **E1-b — Hesap açık, mod seçilmemiş:** adisyon + üç mod butonu
  (*Tamamını öde* · *Eşit böl* · *Kendi ürünlerimi seç*)
- **E1-c — Mod seçili:** adisyon + ilerleme ("3 payın 2'si ödendi · kalan 160,00 TL") +
  kullanıcının kendi eylem butonu

Ayrıca:
- **Bölüşme modu masa genelinde geçerli** (R4). İlk ödeme gerçekleşene kadar değiştirilebilir,
  sonra kilitlenir
- **Periyodik yenileme** (D24): bu ekranda ~5 sn; ayrıca kullanıcının kendi hareketinden
  hemen sonra ve **sekmeye geri dönüşte anında**
- Yenileme aynı zamanda oturumun "buradayım" sinyalidir (R7 için son görülme zamanı güncellenir)
- Anonim oturum çerezi oluşturulur — **isim, e-posta, hiçbir alan sorulmaz** (R10)

## Kapsam dışı

Ödeme akışı (T08), ürün seçme (T10), eşit böl (T09).
Bu issue'da mod butonları görünür ama henüz bir yere gitmeyebilir.

---

## Kabul kriterleri

- [ ] QR linki telefondan açılıyor, adisyon ve toplam doğru görünüyor
- [ ] Üç durum (a/b/c) doğru koşullarda gösteriliyor
- [ ] Kurulum ekranından ürün eklendiğinde müşteri ekranı ~5 sn içinde kendiliğinden güncelleniyor
- [ ] Sekme değiştirip geri dönünce anında yenileniyor
- [ ] Yenileme sırasında "yükleniyor" sıçraması yok, sayılar sakin güncelleniyor
- [ ] Hiçbir yerde form alanı yok
- [ ] Masa kapandığında link E1-a durumuna düşüyor
