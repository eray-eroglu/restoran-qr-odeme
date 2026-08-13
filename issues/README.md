# İş Listesi (v1)

`PRODUCT.md`'deki v1 tanımının tek tek yazılabilir parçalara bölünmüş hali.

## Nasıl çalışılır

- **Bloklayanı bitmemiş issue'ya başlama.** Her issue'nun başında "Bloklayan" satırı var.
- **Her issue ayrı bir oturumda yapılır.** Bir issue bitince bağlamı temizle (`/clear`), sonrakine
  sıfırdan başla. Her issue kendi kendine yeter — PRODUCT.md ile birlikte okunduğunda yeterlidir.
- Biten issue'nun başlığındaki `[ ]` işaretini `[x]` yap.

## Sıra ve bağımlılıklar

```
T01 ─┬─ T03 ─────────────┐
     ├─ T02 ─┬─ T05 ─ T06 ─ T07 ─┴─ T08 ─┬─ T09 ─┐
     └─ T04 ─┘                            ├─ T10 ─┼─ T13
                                          ├─ T11 ─┤
                                          └─ T12 ─┘
T00 (hesap açılışları) — T01'den önce, senin yapman gereken adımlar
```

**T08 dönüm noktasıdır:** orada elinde eksik ama **uçtan uca çalışan** bir ürün olur.

## Liste

| # | Başlık | Bloklayan | Kim |
|---|---|---|---|
| [ ] [T00](T00-hesaplar.md) | Hesap açılışları (iyzico, Vercel, veritabanı, alan adı) | — | **Sen** |
| [ ] [T01](T01-iskelet.md) | Proje iskeleti ve canlıya alma | T00 | Ajan |
| [ ] [T02](T02-veri-modeli.md) | Veri modeli ve şema | T01 | Ajan |
| [ ] [T03](T03-odeme-dikey-dilim.md) | **Ödeme dikey dilimi (en riskli parça)** | T01 | Ajan |
| [ ] [T04](T04-kurulum-giris.md) | Kurulum: şifre girişi (E7) | T01 | Ajan |
| [ ] [T05](T05-kurulum-masa-listesi.md) | Kurulum: masa listesi (E8) | T02, T04 | Ajan |
| [ ] [T06](T06-kurulum-masa-detayi.md) | Kurulum: masa detayı (E9) | T05 | Ajan |
| [ ] [T07](T07-hesap-ekrani.md) | Hesap ekranı ve yenileme (E1) | T02, T06 | Ajan |
| [ ] [T08](T08-tamamini-ode.md) | **"Tamamını öde" — ilk uçtan uca akış** (E4, E5, E6) | T03, T07 | Ajan |
| [ ] [T09](T09-esit-bol.md) | Eşit böl (E2) | T08 | Ajan |
| [ ] [T10](T10-urun-secme.md) | Ürün seçme ve kilitleme (E3) | T08 | Ajan |
| [ ] [T11](T11-bahsis-makbuz.md) | Bahşiş ve makbuz | T08 | Ajan |
| [ ] [T12](T12-kenar-durumlar.md) | Kenar durumlar ve kaçış valfleri | T08 | Ajan |
| [ ] [T13](T13-cihaz-testi.md) | Gerçek cihaz testi ve cila | T09-T12 | Ajan + **Sen** |
