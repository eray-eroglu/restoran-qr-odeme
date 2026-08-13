# Ürün Tanımı — Restoran QR Hesap Bölüşme ve Ödeme (v1)

> Bu belge, tasarım ve geliştirmeye verilebilecek **kilitlenmiş v1 tanımıdır.**
> Kararların gerekçeleri için: [CONTEXT.md](CONTEXT.md)
> Tarih: 2026-08-11

---

## 1. Ürün nedir

Restoranda her masada kalıcı bir QR kod bulunur. Masadaki müşteriler QR'ı telefonlarıyla
okutur — **uygulama indirmeden, kayıt olmadan, hiçbir bilgi girmeden** — o masanın güncel
adisyonunu görür ve hesabı üç yoldan biriyle öder:

1. **Hesabın tamamını öde**
2. **Kişi sayısına eşit böl**
3. **Kendi yiyip içtiği ürünleri seçerek kendi payını öde**

Herkes kendi payını kendi telefonundan bağımsız olarak öder. Hesabın tamamı ödendiğinde masa
otomatik kapanır.

**Çözdüğü sorun:** kalabalık masalarda hesap kapatma. Garson POS cihazını masaya defalarca
taşır, herkes sırayla kart uzatır, "sen ne yedin ben ne yedim" pazarlığı yapılır ve masa
15-20 dakika boşalmaz. Ürün bu turu tamamen ortadan kaldırır.

**Kime satılıyor (ileride):** kalabalık masalı, oturmalı mekanlar — meyhane, bar, brunch
mekanı, pub. Gelir modeli **şube başı aylık abonelik**; işlem komisyonu yok. Satış argümanı
komisyon tasarrufu değil, **masa devir hızı**.

**Pazar:** Türkiye, ilk olarak İstanbul.

**Konumlandırma (bilinçli tercih):** Rakiplerin çoğu restoranın operasyonunu değiştirmesini
ister — sipariş akışını taşı, POS'unu bırak, yeni bir sistem öğren. Bu ürün bunu istemez:

> **"Hiçbir şeyinizi değiştirmiyoruz. Sadece hesap kapatma turunu siliyoruz."**

Özellik listesinde daha dar görünmek kasıtlıdır; restorandan istenen taahhüdü küçülterek
"evet" almayı kolaylaştırır. (Sipariş alma v2'de gelecek, ama konumlandırma bu kalacak.)

---

## 2. v1 neyi kanıtlamaya çalışıyor

**v1 bir restoran ürünü değildir.** Geliştiricinin kendi arkadaş grubuyla test edeceği,
müşteri deneyimini doğrulama aracıdır. Bu yüzden v1'de restoran yok, garson yok, POS yok.

**Başarı kriteri:**

> Bir arkadaş grubu (4-5 kişi), geliştiriciden hiç yardım almadan hesabı bölüşüp ödemeyi
> hızlıca tamamlayabiliyor ve sonrasında deneyimden memnun olduğunu söylüyor.

Bu kriter, kapsam tartışmalarının hakemidir: **bir özellik olmadan da bu kriter sağlanıyorsa,
o özellik v1'e girmez.** Tasarımın en önemli hedefi hız ve anlaşılırlıktır; görsel iddia
ikinci sıradadır.

**v1'den sonraki adım:** ürünü gerçek restoranlara kullandırıp geri bildirim toplamak.

---

## 3. Sözlük

| Terim | Tanım |
|---|---|
| **Masa** | Fiziksel masa. Kalıcı, değişmeyen bir QR koda sahiptir. |
| **Adisyon** | Bir masaya ait ürün listesi ve toplam tutar. Bir masa gün içinde birçok adisyon görür. |
| **Oturum** | Bir kişinin QR okutmasıyla başlayan tarayıcı oturumu. Kimlik değildir, isimsizdir. |
| **Pay** | Bir kişinin ödemeyi üstlendiği tutar. |
| **Bölüşme modu** | Masa genelinde seçilen üç yöntemden biri. |
| **Kalan bakiye** | Güncel toplam − ödenen toplam. Masanın kapanma koşulu. |
| **Makbuz** | Ödeme sonrası gösterilen dijital kanıt. **Yasal fiş değildir.** |
| **Kurulum ekranı** | v1'de restoran olmadığı için geliştiricinin masa/adisyon oluşturduğu yönetim ekranı. |

---

## 4. Aktörler

- **Müşteri** — masada oturan kişi. Telefonunda mobil web. Kayıt yok, isim yok, uygulama yok.
- **Geliştirici (v1'de restoran yerine geçer)** — kurulum ekranından masayı ve adisyonu oluşturur.

---

## 5. Uçtan uca senaryo

1. Geliştirici kurulum ekranından bir masa oluşturur, demo menüsünden ürünleri tıklayarak
   ekler ve masayı **ödemeye açar**.
2. Masadaki ilk kişi QR'ı okutur. **Hesap ekranı** açılır: adisyon, toplam tutar, üç mod butonu.
3. İlk kişi bir mod seçer. Seçilen mod **masa genelinde geçerlidir**; ilk ödeme yapılana kadar
   değiştirilebilir, sonra kilitlenir.
4. Diğerleri QR'ı okutur ve aynı masayı, aynı modda, canlı ilerlemeyle görür.
5. Herkes payını öder (3D Secure). Ödeyen kişi makbuzu görür.
6. Kalan bakiye 0 olduğunda masa **otomatik kapanır** ve herkesin ekranı "hesap tamamen ödendi"
   durumuna geçer. QR o andan itibaren "bu masada açık hesap yok" gösterir.

---

## 6. Ekranlar (v1'de toplam 9)

### Müşteri tarafı — mobil web, dikey, tek elle kullanılabilir

#### E1. Hesap ekranı
QR okutunca açılan ana ekran. Kullanıcı buraya defalarca döner; ürünün kalbi budur.

**İçerik:** adisyon kalemleri (ürün adı, adet, tutar) · toplam tutar · **ödenen ve kalan
bakiye** · ilerleme göstergesi · bölüşme modu seçimi.

**Durumlar:**
- **E1-a — Açık hesap yok:** "Bu masada şu anda açık bir hesap yok." Başka hiçbir şey yok.
- **E1-b — Hesap açık, mod seçilmemiş:** adisyon + üç büyük buton:
  *Hesabın tamamını öde* · *Eşit böl* · *Kendi ürünlerimi seç*
- **E1-c — Mod seçili, ödeme sürüyor:** adisyon + ilerleme ("**3 payın 2'si ödendi** ·
  kalan 160,00 TL") + kullanıcının kendi eylem butonu ("Payımı öde" / "Ürünlerimi seç" /
  "Kalanı ben ödeyeyim").

**Not:** Bu ekran ~1,5–5 saniyede bir kendini yeniler; başkalarının ödemeleri ve seçimleri
canlı gibi akar. Bu akış görsel olarak sakin olmalı — sayılar sıçramamalı, yenileme
"yükleniyor" hissi vermemeli.

#### E2. Kişi sayısı
Yalnızca **"Eşit böl"** seçildiğinde ve yalnızca **ilk kişiye** gösterilir. Tek soru:
"Masada kaç kişisiniz?" Sayı masaya sabitlenir; ilk ödeme gerçekleştikten sonra değiştirilemez.
Sonraki kişiler bu ekranı hiç görmez.

*Ayrı ekran yerine E1 içinde bir adım olarak da tasarlanabilir.*

#### E3. Ürün seçme
Yalnızca **"Kendi ürünlerimi seç"** modunda. Adisyondaki her adet ayrı ayrı seçilebilir
("2x Köfte" iki ayrı satır gibi davranır).

**Her adedin üç hali var ve görsel olarak birbirinden kesin ayrılmalı:**
- **Seçilebilir** — dokunulabilir
- **Başkası seçmiş (kilitli)** — dokunulamaz; isim gösterilmez, sadece "seçildi"
- **Ödenmiş** — kalıcı olarak kapalı

Altta canlı toplam ve "Öde" butonu. Kullanıcı seçimini istediği zaman geri alabilir.

**Çakışma durumu:** iki kişi neredeyse aynı anda aynı adede dokunursa ikincisi kibar bir
uyarı görür: *"Bu ürünü az önce başkası seçti."* Bu bir hata değil, normal bir durumdur —
tasarımı da öyle olmalı (kırmızı hata değil, yumuşak bilgi).

#### E4. Ödeme
**İçerik:**
- Ödenecek tutar (büyük, tartışmasız)
- **Bahşiş satırı:** %5 / %10 / %15 / Yok — tek satır, varsayılan seçili değil, atlanabilir.
  Seçilince toplam anında güncellenir.
- Kart formu (kart no, son kullanma, CVC)
- "Öde" → 3D Secure sayfasına yönlendirme

Toplam iki sayı olarak açıkça gösterilir: **hesap payı** ve **bahşiş**.

#### E5. Sonuç
- **Başarılı:** makbuz — ödenen tutar, bahşiş, tarih/saat, masa. Adresi **kalıcıdır**;
  kullanıcı ekran görüntüsü alabilir veya linki saklayabilir. Altında masanın güncel durumu
  ("kalan 160,00 TL") ve hesap ekranına dönüş.
- **Başarısız:** ne olduğu sade bir dille + "Tekrar dene". Seçilmiş ürünler serbest bırakılır.

> **Yasal not:** bu bir **makbuzdur, fiş değildir.** Ekranda bunun anlaşılır olması gerekir;
> yasal fiş restoranın kendi cihazından kesilir.

#### E6. Masa kapandı
Kalan bakiye 0 olduğunda herkesin ekranı buraya geçer: "Hesap tamamen ödendi. Teşekkürler."

*Ayrı ekran yerine E1'in bir durumu olarak da tasarlanabilir.*

---

### Kurulum tarafı — geliştiricinin ekranı, masaüstü/tablet

Bu üç ekranın görsel iddiası yoktur; işlevsel ve hızlı olmaları yeterlidir. İleride restoran
panelinin tohumudur.

#### E7. Şifre girişi
Tek alan, ortam değişkeninde tanımlı tek ortak şifre. Kullanıcı hesabı, kayıt, parola
sıfırlama **yoktur**.

#### E8. Masa listesi
Açık masalar; her satırda toplam, ödenen, kalan bakiye ve mod. Üstte **"Yeni masa"** ve
**"Örnek masa oluştur"** (içi dolu bir masayı tek tıkla üretir — tekrarlı test için).

#### E9. Masa detayı
- Demo menüsünden tıklayarak ürün ekleme / çıkarma
- **Masayı ödemeye aç**
- Masanın **QR linkini** göster (ekranda okutulabilir QR olarak)
- Ödeme dökümü: her ödeme için **hesap payı** ve **bahşiş** ayrı ayrı
- **Masayı manuel kapat** (kaçış valfi — kalan bakiye başka yolla tahsil edilmiş sayılır)

---

## 7. İş kuralları (kesin, tartışmasız)

**R1 — Bakiye kuralı.**
Ödenen tutar asla geri alınmaz. Adisyon ödeme sürerken büyüyebilir.
`Kalan bakiye = güncel toplam − ödenen toplam`.
Masa **yalnızca kalan bakiye 0 olduğunda** otomatik kapanır.

**R2 — Pay hesabı ve kuruş artığı.**
`Bir ödemenin tutarı = kalan bakiye ÷ kalan ödenmemiş pay sayısı` (kuruşa yuvarlanır).
**Son kalan pay, kalan bakiyenin tamamıdır.**
Bu tek kural, 100 ÷ 3 gibi kuruş artıklarını, adisyonun ödeme sırasında büyümesini ve
"kalanı ben ödeyeyim" durumunu birlikte çözer.

**R3 — Bahşiş bakiyeden bağımsızdır.**
Her ödeme iki ayrı sayı taşır: hesaba giden tutar ve bahşiş. Kalan bakiyeden **yalnızca**
hesaba giden tutar düşülür. Masanın kapanması bahşişe bakmaz.

**R4 — Bölüşme modu masa genelinde kilitlidir.**
Masada tek bir mod geçerlidir. İlk ödeme gerçekleşene kadar değiştirilebilir, sonra kilitlenir.
Modların karışması (kimi eşit böler, kimi ürün seçer) v1'de **mümkün değildir**.

**R5 — Kişi sayısını ilk kişi belirler.**
Eşit böl modunda kişi sayısı ilk giren tarafından girilir ve masaya sabitlenir; ilk ödemeden
sonra değiştirilemez. Sistem kimin ödediğini bilmez, **kaç payın ödendiğini sayar**.

**R6 — Kilidin sahibi sunucudur.**
Ürün seçimi arayüzde anında görünür (iyimser), ama gerçek kilit sunucudadır. Sunucu ikinci
seçimi reddederse kullanıcıya "az önce başkası seçti" gösterilir.

**R7 — Sessizleşen oturumun kilidi düşer.**
Bir telefon ~60 saniye boyunca sunucuya hiç uğramazsa (sayfa kapandı, ekran kilitlendi) o
oturumun **ödenmemiş** seçimleri serbest bırakılır. **Ödenmiş** seçimler asla serbest kalmaz.

**R8 — Ödeme doğrulaması sunucu tarafındadır.**
Bir pay, yalnızca sunucu ödeme sağlayıcısından onay aldıktan sonra ödenmiş sayılır.
Tarayıcıdan gelen sonuç yalnızca "git ve kontrol et" tetiğidir. Kullanıcı 3D ekranından hiç
dönmese bile pay doğru şekilde ödenmiş görünür.

**R9 — QR kalıcıdır, içerik değişkendir.**
QR sabit bir adrese gider: `/m/<tahmin-edilemez-rastgele-token>`. "masa-7" gibi tahmin
edilebilir değer **kullanılmaz**. Sunucu o masada ödemeye açık bir hesap olup olmadığına
bakar; yoksa E1-a gösterilir. Masa kapanınca link ölür, yeni hesap açılınca aynı QR canlanır.

**R10 — Sıfır form alanı.**
v1'de kullanıcıdan hiçbir kişisel bilgi alınmaz: isim yok, e-posta yok, telefon yok, kayıt
yok, SMS doğrulaması yok. Tek girilen şey kart bilgisidir.

---

## 8. v1 kapsamı DIŞINDA (bilinçli kararlar)

Bunlar unutulmuş değil, **kasıtlı olarak çıkarılmıştır**. Tasarımda bunlara ait ekran,
buton veya boşluk **bulunmamalıdır**.

| Kapsam dışı | Ne zaman |
|---|---|
| QR'dan sipariş verme | v2 |
| Menü görüntüleme | v1.5 |
| POS / adisyon sistemi entegrasyonu | v2 |
| Kişi bazlı yasal fiş | v2 (POS entegrasyonuyla birlikte) |
| Restoran / garson paneli | İlk pilot restoranla birlikte |
| Gerçek para (sandbox kullanılıyor) | İlk pilot restoranla birlikte |
| E-posta ile makbuz | v1.5 |
| İade akışı | Gerçek paraya geçişte |
| Apple Pay / Google Pay | v1.5 |
| İngilizce ve diğer diller | v1.5 |
| Tek ürünü birden çok kişiye bölme (şarap şişesi) | v2 |
| Karma bölüşme modu (kimi eşit böler, kimi ürün seçer) | v2 / v3 |
| Masa birleştirme, taşıma, masaya sonradan katılan kişi | v2 |
| Kullanıcı hesabı, geçmiş, sadakat | Yok |

---

## 9. Teknik kısıtlar

- **Stack:** Next.js + Postgres + Vercel. Müşteri sitesi ve kurulum ekranı **tek kod tabanı**,
  tek deploy.
- **v1 yayında olmak zorundadır.** 3D Secure geri dönüşü herkese açık bir HTTPS adresi ister;
  localhost'ta arkadaş testi yapılamaz.
- **Gerçek veritabanı şarttır.** Birden çok telefon aynı masayı paylaşır; durum bellekte
  tutulamaz.
- **Ödeme sağlayıcısı:** iyzico **sandbox**. Test hesabı e-posta ile açılır, test kartlarıyla
  çalışılır, gerçek para akmaz, şirket gerekmez. Ödeme entegrasyonu kodda **tek bir katmanın
  arkasında** durur; sağlayıcı değişirse tek yer değişir.
- **Güncelleme:** gerçek zamanlı bağlantı (WebSocket/SSE) **yoktur**. Periyodik yenileme:
  ürün seçme ekranında ~1,5 sn, diğer ekranlarda ~5 sn; ayrıca kullanıcının kendi
  hareketinden sonra ve sekmeye geri dönüşte anında.
- **Dil:** yalnızca Türkçe, ama **tüm arayüz metinleri tek bir dosyada** toplanır; koda gömülmez.
- **Para birimi:** TL. Tüm tutarlar kuruş hassasiyetinde tutulur.

---

## 10. Yol haritası

| Sürüm | İçerik |
|---|---|
| **v1** | Bu belge. Arkadaş testi, sandbox, kurulum ekranı. |
| **v1.5** | Menü görüntüleme · e-posta makbuz · İngilizce · Apple/Google Pay |
| **v2** | İlk pilot restoran: gerçek para, restoran/garson paneli, POS entegrasyonu, kişi bazlı fiş, iade akışı, ürün bölüştürme, **QR'dan sipariş verme** |
| **v3** | Karma bölüşme modu, çok şubeli işletme yönetimi |

> **Not:** v2 bu haliyle çok büyük bir sürüm. Pilot restoran bulunduğunda ikiye bölünmesi
> gerekebilir (önce gerçek para + restoran paneli, sonra POS entegrasyonu + sipariş).
> Bu karar pilot restoranın ihtiyacına göre verilecek.
