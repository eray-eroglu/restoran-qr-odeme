# Restoran QR Ödeme — CONTEXT

> Bu dosya, ürün tanımı netleşene kadar alınan **kararların** ve **açık soruların** tek kaynağıdır.
> Nihai çıktı: Claude Design'a verilebilecek net, tutarlı, uygulanabilir ürün tanımı.
> Son güncelleme: 2026-08-11 — **Tüm turlar tamamlandı, açık soru kalmadı.**
> Ürün tanımı: [PRODUCT.md](PRODUCT.md)

---

## 1. Ürün özeti (bir paragraf)

Restoranda her masada bir QR kod bulunur. Masadaki müşteriler QR'ı telefonlarıyla okutur,
**uygulama indirmeden** o masanın güncel adisyonunu görür ve hesabı üç şekilden biriyle öder:
tamamını, kişi sayısına eşit bölerek, ya da kendi yiyip içtiği ürünleri seçerek. Herkes kendi
payını bağımsız öder; tüm hesap ödendiğinde masa kapanır.

---

## 2. Sözlük (ubiquitous language)

Terimler netleştikçe burası doldurulacak. Şimdilik dikkat edilecek çakışmalar:

| Terim | Tanım | Not |
|---|---|---|
| **Masa** | Fiziksel masa. Sabit bir QR koda sahiptir. | Masa ≠ Adisyon. Bir masa gün içinde çok adisyon görür. |
| **Adisyon** | Bir masaya ait, açılış-kapanış arası ürün listesi + tutar. | POS tarafındaki "hesap". |
| **Oturum (Session)** | Bir müşterinin QR okutmasıyla başlayan tarayıcı oturumu. | Kimlik değil. Kaç kişi olduğu bilinmez. |
| **Pay** | Bir kişinin ödemeyi taahhüt ettiği tutar. | Ödeme öncesi geçici, ödeme sonrası kalıcı. |
| **Fiş** | Yasal ÖKC belgesi. | Bizim ürettiğimiz "makbuz" fiş DEĞİLDİR. Bkz. Q9. |
| **Makbuz** | Bizim müşteriye gösterdiğimiz ödeme kanıtı. | Yasal belge değil. |

---

## 3. Kararlar (Tur 1)

### D1 — Pazar: Türkiye / İstanbul
İlk pazar Türkiye, ağırlıklı İstanbul. Mevzuat (Yeni Nesil ÖKC, fiş zorunluluğu) ve
POS ekosistemi buna göre tasarlanacak.

### D2 — Kapsam: Sadece ödeme (v1)
v1 yalnızca **ödeme**. Sipariş alma kapsam dışı.
Yol haritası: **v1 ödeme → v1.5 menü görüntüleme → v2 QR'dan sipariş**.

### D3 — Hedef segment: esnek, kalabalık masa ağırlıklı
Segment kilitlenmeyecek; ihtiyacı olan her işletmeye satılabilir. Ama ürün tasarımı
**kalabalık masalı mekanlar** (meyhane/bar/brunch/pub) üzerinden yapılacak — hesap
bölüşme acısı orada en yüksek.

### D4 — Adisyon kaynağı: v1'de manuel, POS entegrasyonu v2
v1'de POS entegrasyonu **yok**. Adisyon verisi restoran personeli tarafından bizim
panelimize girilir. Gerekçe: maliyeti düşük tutmak, hızlı sahaya çıkmak, restoranların
ürünü kabul edip etmeyeceğini test etmek.
**Risk (kabul edildi):** çift veri girişi. Bu riskin nasıl azaltılacağı → Q10.
POS entegrasyonu (Adisyo/Simpra vb.) v2'ye ertelendi.

### D5 — Para akışı: doğrudan model (restoranın kendi üye işyeri hesabı)
Para bize uğramaz. Her restoran iyzico/PayTR gibi bir sağlayıcıda **kendi** üye işyeri
hesabını açar; ödeme doğrudan restorana gider. Biz sadece ödeme akışını yönetiriz.
Gerekçe: gelir modeli abonelik olduğu için komisyon kesme ihtiyacı yok → toplayıcı
(aracı) olmanın tek gerçek avantajı ortadan kalkıyor. Yasal yük sıfır, ödeme kuruluşu
lisansı gerekmiyor.
**Kabul edilen bedel:** her yeni restoran için üye işyeri açılış süreci (1-3 gün).
Ölçeklendiğinde (10+ restoran) "alt üye işyeri / marketplace" modeline geçiş değerlendirilecek.

### D6 — Gelir modeli: aylık abonelik
Şube başı (veya masa başı) aylık sabit abonelik. İşlem komisyonu yok.
Satış argümanı: **masa devir hızı** — garsonun hesap kapatma turlarının ortadan kalkması.

### D7 — Bahşiş: opsiyonel, ödeme ekranında
Ödeme ekranında "bahşiş bırak" seçeneği sunulur. Zorunlu değil.
Bahşişin garsona mı yazılacağı yoksa havuza mı gireceği **işletmenin kendi kararıdır**;
ürün bunu bir ayar olarak sunar, dağıtımı yönetmez.

### D8 — Ekip ve hedef: solo geliştirici, mümkün olan en basit v1
Tek kişi. Amaç: restoranların ürünü benimseyip benimsemeyeceğini ölçecek **en basit
çalışan versiyon**. Karmaşıklık sonraya. Pilot restoran durumu henüz netleşmedi.

---

## 4. Kararlar (Tur 2)

### D9 — Fiş: v1'de dijital makbuz, yasal fiş restoranda
v1'de kullanıcıya **dijital makbuz** (yasal belge değil) gösterilir. Yasal fiş her zamanki
gibi restoranın ÖKC cihazından kesilir. **Kişi bazlı fiş v1 kapsamı dışıdır** ve POS
entegrasyonuyla birlikte v2'de gelir.

### D10 — v1'de restoran tarafı yok; adisyonu geliştirici kurar
**Yeniden çerçeveleme:** v1 bir restoran ürünü değil, **müşteri deneyimini doğrulama
aracıdır**. Geliştirici arkadaş grubuyla test edecek. Dolayısıyla v1'de POS entegrasyonu,
garson paneli ve çift veri girişi problemi **yoktur**; adisyonu basit bir kurulum
ekranından geliştirici kendisi girer.
Restoran tarafının nasıl çalışacağı (POS entegrasyonu mu, manuel panel mi) **ilk pilot
restoran bulunduğunda** karara bağlanacak — o an hangi POS'un kullanıldığı da öğrenilmiş olur.
Hedef durum (v2+): garsonun tek bir yere girmesi, mutfak/POS ile entegre.

### D11 — Kimlik: tam anonim, isim yok
Kullanıcıdan isim/takma ad **istenmez**. Masadaki koordinasyon samimiyete bırakılır.
Ödeme sonrası **opsiyonel e-posta** alınır (yalnızca dijital makbuz için).
SMS doğrulaması yok, hesap açma yok, uygulama yok.

### D12 — Eşzamanlılık: adet bazlı kilitleme
Bir kullanıcı bir ürün adedini kendi payına eklediğinde o adet diğerlerinde kilitlenir.
"2x köfte" iki ayrı seçilebilir adet gibi davranır. v1'de **tek bir ürünü birden çok
kişiye bölme yoktur** (v2). Kilitlerin zaman aşımı olmalıdır (öneri: 5 dk).

### D13 — Bakiye kuralı (v1'in en kritik kuralı)
> **Ödenen tutar asla geri alınmaz. Adisyon ödeme sırasında büyüyebilir.
> Kalan bakiye = güncel toplam − ödenen toplam. Masa yalnızca kalan bakiye 0 olduğunda kapanır.**

### D14 — Ödeme: sadece kart, 3D Secure zorunlu
v1'de yalnızca kredi/banka kartı, 3D Secure zorunlu. Apple Pay / Google Pay yok
(Türkiye'de yaygın değil). Başarısız 3D işleminde kilitlenen ürünler serbest bırakılır.

### D15 — QR: statik masa QR'ı + oturum kısıtı
Masaya kalıcı olarak yapıştırılan, **tahmin edilemez rastgele token** taşıyan tek bir QR
(`/m/<rastgele-token>`; "masa-7" gibi tahmin edilebilir değer kullanılmaz). Sunucu o masada
**ödemeye açık bir hesap olup olmadığını** kontrol eder; yoksa "bu masada açık hesap yok"
gösterir. Masa kapanınca link ölür, yeni hesap açılınca aynı QR yeniden canlanır.

---

## 5. v1 tasarım ilkesi (kullanıcının açık talebi)

**İlk versiyon olabildiğince basit olacak.** Geliştirici tek başına, arkadaş grubuyla test
edecek; kolay ve rahat bulunursa restoranlarla görüşmeye geçilecek. Bu yüzden her özellik
sorusunda varsayılan cevap "v1'e koyma"dır; aksini gerektiren güçlü bir gerekçe olmalıdır.

---

## 6. Kararlar (Tur 3)

### D16 — v1 başarı kriteri
> **Bir arkadaş grubu (4-5 kişi), geliştiriciden hiç yardım almadan, hesabı bölüşüp
> ödemeyi hızlıca tamamlayabiliyor ve sonrasında deneyimden memnun olduklarını
> söylüyor (kısa anket).**

Bu kriter, "bu özellik v1'e girsin mi?" sorusunun hakemidir: özellik olmadan kriter
sağlanıyorsa özellik v1'e girmez.
Bir sonraki adım (v1'den sonra): ürünü restoranlara kullandırmak ve onların geri
bildirimiyle geliştirmek.

### D17 — Ödeme: sandbox (test modu)
v1'de gerçek para akmaz. Ödeme sağlayıcının **test ortamı** kullanılır; 3D Secure akışı
dahil gerçek ödeme akışı uçtan uca çalışır, test kartlarıyla denenir.
Sonuç: şirket kurma / üye işyeri başvurusu **ilk pilot restorana kadar ertelendi**.

### D18 — Adisyon kurulumu: sabit menü + tıklayarak ekleme + örnek masa
Küçük ve sabit bir demo menüsü tanımlanır (~20 ürün). Geliştirici ürünlere tıklayarak
masa kurar. Ayrıca **"örnek masa oluştur"** butonu ile içi dolu bir masa tek tıkla üretilir
(tekrarlı test için). Bu ekran yalnızca geliştiricinin kullandığı kurulum ekranıdır;
görsel özen gerektirmez.

### D19 — "Eşit böl": kişi sayısını ilk kişi girer, sabitlenir
Masaya ilk giren kişi kişi sayısını belirler; sayı masaya sabitlenir ve ilk ödeme
gerçekleştikten sonra değiştirilemez. Sistemin kimin ödediğini bilmesine gerek yoktur;
**kaç payın ödendiğini saymak** yeterlidir. Herkesin ekranında "3 payın 2'si ödendi,
kalan pay: 160 TL" görünür.
Sonradan masaya katılan kişi senaryosu **kapsam dışıdır** (hesap ödeniyorsa masadan
kalkılıyordur, yeni sipariş beklenmez).

### D20 — Bölüşme modu masa genelinde kilitli (v1)
Masa açılışında bir kez mod seçilir: **tamamını öde / eşit böl / kendi ürünlerini seç**.
Seçilen mod masa geneli için geçerlidir; **ilk ödeme gerçekleşene kadar** değiştirilebilir,
sonra kilitlenir. Modların karışması (kimi eşit böler, kimi ürün seçer) **v1 kapsamı
dışıdır** — v2/v3'te değerlendirilecek.

### D21 — Masanın kapanması ve eksik bakiye
Masa **yalnızca kalan bakiye 0 olduğunda** otomatik kapanır. Eksik bakiye için iki yol
v1'de birlikte bulunur:
1. **"Kalanı ben ödeyeyim"** — masadaki herhangi biri kalan bakiyenin tamamını üstlenebilir.
2. **Manuel kapatma (kaçış valfi)** — kalan bakiye başka yolla (nakit/POS) tahsil edilmiş
   sayılarak masa kurulum ekranından kapatılabilir.

Ürünün tek ilgilendiği şey masanın hesabının kapanıp kapanmadığıdır; nasıl kapandığı
esnektir.

---

## 7. Kararlar (Tur 4)

### D22 — Bahşiş v1'de var
Ödeme ekranında **tek satır**: %5 / %10 / %15 / Yok. Varsayılan seçili değil, atlanabilir.
Ayrı ekran değildir. Bahşişin dağıtımı ürünün sorunu değildir (bkz. D7).

### D23 — Makbuz: sadece ekranda, kalıcı adresle. E-posta yok.
Ödeme sonrası makbuz ekranda gösterilir ve adresi kalıcıdır (kullanıcı ekran görüntüsü
alabilir veya linki saklayabilir). **v1'de e-posta yoktur.**
→ Bu D11'i revize eder: **v1'de kullanıcıdan hiçbir bilgi alınmaz** — ne isim, ne e-posta,
ne telefon. Sıfır form alanı. Test edilen his tam olarak budur.

### D24 — Güncelleme: periyodik yenileme (polling), sunucu hakem
Gerçek zamanlı bağlantı (WebSocket/SSE) **yoktur**. Telefon sunucuya periyodik olarak sorar:
ürün seçme ekranında ~1.5 sn, özet/bekleme ekranında ~5 sn.
Ek olarak: kullanıcının **kendi hareketinden hemen sonra** ve **sekmeye geri döndüğünde**
anında yenilenir.
**Kural: kilidin gerçek sahibi sunucudur.** Arayüz iyimser davranır (kendi hareketin anında
görünür), sunucu reddederse "Bu ürünü az önce başkası seçti" gösterilir.
Gerekçe: gecikme yalnızca *başkasının* hareketini görmede geçerlidir ve aynı masada oturan
insanlar için fark edilmez. Aynı anda aynı ürüne dokunma yarışı gerçek zamanlı bağlantıda
da olur; onu çözen şey sunucunun hakem olmasıdır.

### D25 — Seçim geri alma ve kilit düşmesi
Kullanıcı seçimini istediği zaman geri alabilir. Ayrıca telefon ~60 saniye boyunca sunucuya
hiç uğramazsa (sayfa kapandı/ekran kilitlendi) o oturumun **ödenmemiş** seçimleri otomatik
serbest bırakılır. Periyodik yenileme aynı zamanda "buradayım" sinyalidir; ayrı zamanlayıcı
gerekmez. **Ödenmiş** seçimler asla serbest bırakılmaz (D13).

### D26 — Kurulum ekranı: tanım ve koruma
**Kurulum ekranı**, v1'de restoran/garson olmadığı için geliştiricinin kullandığı yönetim
ekranıdır. Yaptıkları: masa oluştur · demo menüsünden tıklayarak ürün ekle · "örnek masa
oluştur" · masayı ödemeye aç · masanın QR linkini al · masayı manuel kapat (D21 kaçış valfi).
Müşteri sitesiyle **aynı alan adında** yayınlanır; bu yüzden **tek ortak şifre** ile korunur
(ortam değişkeninde tanımlı, tek alanlı giriş). Kullanıcı hesabı/kayıt yoktur.
Bu ekran, ileride restoran panelinin tohumudur.

### D27 — Dil: yalnızca Türkçe
v1 tek dil (Türkçe). Ancak **tüm arayüz metinleri tek bir dosyada toplanır**, koda gömülmez;
böylece ileride İngilizce eklemek dosya kopyalamaya iner.

---

## 8. Kararlar (Tur 5-6)

### D28 — v1 ekran envanteri: 9 ekran
Müşteri tarafı 6, kurulum tarafı 3. Tam liste `PRODUCT.md` bölüm 6'da.
"Kişi sayısı" ve "masa kapandı" ekranları, ayrı ekran yerine hesap ekranının içinde birer
durum olarak da tasarlanabilir (Design'ın takdirinde).

### D29 — Stack: Next.js + Postgres + Vercel
Tek kod tabanı (müşteri sitesi + kurulum ekranı), tek deploy, hazır HTTPS.
Belirleyici kısıtlar: 3D Secure geri dönüşü herkese açık HTTPS adresi ister (localhost'ta
arkadaş testi yapılamaz, v1 yayında olmak zorundadır); birden çok telefon aynı masayı
paylaştığı için gerçek veritabanı şarttır.

### D30 — Ödeme sağlayıcısı: iyzico (sandbox)
Test hesabı e-posta ile açılır (`sandbox-merchant.iyzipay.com/auth/register`), API anahtarları
panelden alınır, test kartlarıyla çalışılır — sandbox için şirket/üye işyeri başvurusu
gerekmez. Gerçek paraya geçişte aynı sağlayıcıda kalınır.
**Kural:** ödeme entegrasyonu kodda tek bir katmanın arkasında durur; sağlayıcı değişirse
tek yer değişir.

### D31 — Pay hesabı ve kuruş artığı (tek kural)
> **Bir ödemenin tutarı = kalan bakiye ÷ kalan ödenmemiş pay sayısı (kuruşa yuvarlanır).
> Son kalan pay, kalan bakiyenin tamamıdır.**

Bu tek kural üç şeyi birden çözer: kuruş artığı (100 ÷ 3) hep son ödeyene gider ve masa
mutlaka 0'a iner; adisyon ödeme sırasında büyürse paylar kendiliğinden yeniden hesaplanır;
"kalanı ben ödeyeyim" bu kuralın özel halidir.

### D32 — Bahşiş bakiyeden bağımsızdır
Her ödeme iki ayrı sayı taşır: **hesaba giden tutar** ve **bahşiş**. Kalan bakiyeden yalnızca
hesaba giden tutar düşülür. Masanın kapanması bahşişe bakmaz. Makbuzda ve kurulum ekranında
ikisi ayrı görünür.

### D33 — Ödeme doğrulaması sunucu tarafındadır
> **Bir pay, yalnızca sunucu ödeme sağlayıcısından onay aldıktan sonra ödenmiş sayılır.**

Tarayıcıdan gelen sonuç yalnızca "git ve kontrol et" tetiğidir; tarayıcının sözüne güvenilmez.
Kullanıcı 3D ekranından hiç dönmese bile pay doğru şekilde ödenmiş görünür ve masa kapanır.

### D34 — v1'de iade yok
İade akışı v1 kapsamı dışıdır (sandbox'ta gerçek para akmıyor). Hatalı durumlarda masa
kurulum ekranından manuel kapatılır (D21). Gerçek paraya geçişte iade + uyuşmazlık akışı
ayrıca tasarlanacak — o noktada "kim iade edebilir" ciddi bir yetkilendirme tasarımı gerektirir.

---

## 9. Rekabet ve konumlandırma (Tur 7)

### Bilinen rakipler (2026-08-11 itibarıyla)

| Rakip | Ne yapıyor | Gelir modeli |
|---|---|---|
| **HesApp** | QR hesap bölüşme/ödeme. ~2 ay önce kurulmuş, görünürlüğü düşük. | **%1,75 işlem komisyonu** |
| **Alman Hesabı** (almanhesabi.com) | QR'dan **sipariş + hesap bölme**. Basın görünürlüğü var. | **Abonelik** (2.500-5.000 TL bandında fiyat çıpası) |
| **QRPay** (qrpaytr.com) | **Neredeyse birebir aynı konum**: sabit masa QR'ı, eşit/kalem/özel tutar bölüşme, POS'tan bağımsız. Aynı satış argümanları (masa devir hızı, bahşiş). | Bilinmiyor |
| **HesapPOS, YemeQr, Tabpad, Meniyo vb.** | POS ve QR menü şirketleri; hesap bölme ve QR menü zaten var. | — |

**Okuma:** Pazar iki rakipli genç bir pazar değil, **kalabalık**. Rakiplerin varlığı kötü haber
değil (problemin gerçek olduğunun kanıtı), ama iki gerçeği kabul etmek gerekiyor:
1. Kimse henüz kazanmadı — hepsi web sitesi aşamasında görünüyor.
2. **Asıl tehdit startup'lar değil, POS firmaları.** Adisyo/Simpra/HesapPOS bunu bir çeyrekte
   özellik olarak ekleyip POS'un yanında bedava verebilir.

**Yapılacak (kod yazmadan önce, ~2 gün):** bu rakipleri **gerçekten kullanan restoran var mı**
öğren (referans, mekân fotoğrafı, Instagram etiketi, Google yorumu). Web sitesi olan şirket
ile para kazanan şirket farklı şeylerdir. Bu bilgi fiyat kararını doğrudan etkiler.

### D35 — Gelir modeli kararı ertelendi, varsayılan abonelik
D6 **geçici** statüye alındı. Fiyat kararı **ilk 3 restoran görüşmesinden sonra** kilitlenecek;
o zamana kadar varsayılan aylık abonelik. Gerekçe: elde tek bir restoran görüşmesi yokken
fiyat kararı veriye değil rakip taklidine dayanır.
Not: rakiplerden biri komisyon, biri abonelik kullanıyor — abonelik modeli pazarda kanıtsız değil.

### D36 — Konumlandırma: kasıtlı olarak dar
v1 sadece ödeme olarak kalıyor (D2 korundu). Ama bu bir eksiklik değil, **konumlandırma**:

> **"Hiçbir şeyinizi değiştirmiyoruz. Sadece hesap kapatma turunu siliyoruz."**

Rakipler restoranın operasyonunu değiştirmesini istiyor; bu ürün istemiyor. Restorandan
istenen taahhüt küçük olduğu için "evet" alması daha kolay.
**Sipariş özelliği v2'de kesin olarak yapılacak** (v3'ten öne alındı), ama konumlandırma
mesajı değişmeyecek.

### D37 — Savunulabilirlik: önce deneyim, sonra ortaklık
Öncelik **(b) deneyim**: POS firmalarının DNA'sı arka ofis, ön yüz değil — kopyalayamayacakları
tek şey gerçekten iyi bir müşteri deneyimi. v1'in başarı kriteri (D16) zaten budur.
İleride dikkat çekilirse **(c) ortaklık**: POS firmalarına rakip değil, onların yapmak
istemediği **ödeme katmanı** olarak konumlanmak.

---

## 10. Durum

**Açık soru kalmadı.** Ürün tanımı `PRODUCT.md`, tasarım isteği `DESIGN-BRIEF.md` dosyalarında.
v1 planı rekabet bilgisinden etkilenmedi — değişen tek şey yol haritası (sipariş v3→v2) ve
konumlandırma mesajı.
