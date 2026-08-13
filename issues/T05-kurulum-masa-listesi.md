# T05 — Kurulum: masa listesi (E8)

**Bloklayan:** T02, T04
**Referans:** PRODUCT.md E8, R1

---

## Amaç

Masaları görebilmek ve oluşturabilmek.

## Neden bu sırada

Masa oluşturamadan müşteri tarafındaki hiçbir şeyi test edemezsin.

---

## Kapsam

- Açık masaların listesi; her satırda: masa adı, toplam, ödenen, **kalan bakiye**, bölüşme modu
- **"Yeni masa"** butonu
- **"Örnek masa oluştur"** butonu — içi dolu bir masayı tek tıkla üretir (demo menüsünden
  rastgele/sabit birkaç ürünle). Tekrarlı test için; bu buton olmadan her testte elle ürün
  girmek zorunda kalırsın
- Masa satırına tıklayınca masa detayına (T06) gider

## Kapsam dışı

Görsel özen. Bu ekran işlevsel olsun yeter.

---

## Kabul kriterleri

- [ ] Yeni masa oluşturulabiliyor ve listede görünüyor
- [ ] "Örnek masa oluştur" tek tıkla içi dolu bir masa üretiyor
- [ ] Listede kalan bakiye doğru hesaplanıyor (R1: güncel toplam − ödenen toplam)
- [ ] Kapanmış masalar listede açık masalardan ayrılıyor
