# Tasarım İsteği — v1 Wireframe

> Bu dosyayı `PRODUCT.md` ile **birlikte** ver. PRODUCT.md ürünün ne olduğunu anlatır;
> bu dosya şu anda ne istediğini söyler.

---

## Ne istiyorum

`PRODUCT.md` bölüm 6'daki **9 ekranın düşük detaylı (low-fidelity) wireframe'i.**

Bu aşamada renk paleti, tipografi, marka, ikon seti, illüstrasyon **istemiyorum.**
İstediğim tek şey: **her ekranda hangi bilgi var, hangisi daha önemli, kullanıcı hangi
butona basıyor.** Gri kutular ve gerçek metin yeterli.

---

## Kısıtlar

- **Mobil öncelikli.** Müşteri ekranları (E1-E6) 390px genişlikte, dikey, **tek elle**
  kullanılabilir olmalı. Ana eylem butonu başparmağın ulaştığı yerde, ekranın altında.
- **Masada, kalabalıkta, aceleyle kullanılıyor.** Kullanıcı ekranı incelemiyor, bir bakışta
  anlamaya çalışıyor. Sayılar büyük ve tartışmasız olmalı.
- **Kayıt yok, form yok.** Kart bilgisi dışında hiçbir giriş alanı olmayacak
  (`PRODUCT.md` R10). İsim, e-posta, telefon alanı **koyma**.
- Kurulum ekranları (E7-E9) masaüstü, işlevsel, görsel iddiası yok. **En son ele al.**

---

## Bu wireframe'de kritik olan iki ekran

Diğer yedisi kolay; bu ikisi ürünün başarısını belirliyor:

### E1 — Hesap ekranı, bilgi hiyerarşisi
Ekranda dört bilgi yarışıyor: **adisyon kalemleri**, **toplam tutar**, **kalan bakiye ve
ilerleme**, **mod butonları**. Hepsi aynı anda önemli değil.

Benim beklentim: kullanıcı ekrana baktığı ilk saniyede **"ne kadar ödeyeceğim"** sorusunun
cevabını görmeli; adisyon kalemleri ikinci sırada, referans amaçlı. Ama bunu bir öneri olarak
alıp **birkaç alternatif hiyerarşi dene** — hangisinin daha hızlı okunduğunu görmek istiyorum.

### E3 — Ürün seçme, üç hal
Her ürün adedinin üç hali var ve bunlar **bir bakışta** ayrılmalı:
**seçilebilir** · **başkası seçmiş (kilitli)** · **ödenmiş**.

Kilitli ürünlerde **isim gösterilmez** (sistem kimseyi tanımıyor), sadece "seçildi".
Bu üç halin ayrımı wireframe'de bile net olmalı — renk olmadan, sadece biçim ve doku ile.

---

## Mutlaka çiz: sadece mutlu yol değil

Wireframe'lerin en sık kaçırdığı yer burası. Şu durumları da ayrı ayrı istiyorum:

| Durum | Nerede |
|---|---|
| Bu masada açık hesap yok | E1-a |
| Hesap açık, mod henüz seçilmemiş | E1-b |
| Mod seçili, başkaları ödemeye devam ediyor | E1-c |
| "Bu ürünü az önce başkası seçti" uyarısı | E3 — hata gibi değil, yumuşak bilgi |
| Ödeme başarısız oldu | E5 |
| Hesap tamamen ödendi | E6 |

---

## Ekranlarda kullan (gerçekçi örnek içerik)

Boş kutular yerine gerçek içerikle çiz — hiyerarşi ancak gerçek metinle test edilir.

**Masa 7 — Adisyon**
- 2x Adana Kebap — 960,00 TL
- 1x İçli Köfte — 220,00 TL
- 3x Ayran — 135,00 TL
- 2x Efes (50cl) — 380,00 TL
- 1x Künefe — 265,00 TL

**Toplam: 1.960,00 TL** · Ödenen: 653,33 TL · **Kalan: 1.306,67 TL**
İlerleme: *3 payın 1'i ödendi*

---

## Çıktı

Önce **E1'in 2-3 alternatifi**. Onu birlikte netleştirdikten sonra kalan ekranlara geçelim —
hepsini tek seferde çizmeni istemiyorum, çünkü E1'in hiyerarşisi diğerlerini de belirleyecek.
