# T00 — Hesap açılışları

**Bloklayan:** yok
**Kim yapar:** **Sen.** Bunlar hesap açma ve kimlik doğrulama adımları; ajanın erişimi yok.
**Süre:** ~1 saat (iyzico onayı beklerse daha uzun)

---

## Neden bu ilk sırada

T01'den itibaren her şey bunlara bağlı. Ayrıca iyzico tarafında beklenmedik bir engel
çıkarsa bunu **bugün** öğrenmen gerekir, altıncı haftada değil.

---

## Adımlar

### 1. iyzico sandbox hesabı
- `https://sandbox-merchant.iyzipay.com/auth/register` adresinden e-posta ile kayıt ol.
- Panelde **Ayarlar → Şirket Ayarları** bölümünden **API Key** ve **Secret Key**'i al.
- Bu iki anahtarı bir yere kaydet (T01'de `.env` dosyasına girilecek).
- Test kartlarını dokümantasyondan not et: `https://docs.iyzico.com/on-hazirliklar/sandbox`

> Gerçek para akmaz, şirket/vergi numarası gerekmez. Bkz. CONTEXT.md D17, D30.

### 2. Vercel hesabı
- `vercel.com` üzerinden GitHub hesabınla kayıt ol (ücretsiz plan yeterli).

### 3. GitHub deposu
- GitHub'da `restoran-qr-odeme` adında **private** bir depo aç.
- Deponun adresini not et (T01'de bu yerel repo oraya bağlanacak).

### 4. Veritabanı
- `neon.tech` veya `supabase.com` üzerinden ücretsiz bir Postgres veritabanı oluştur.
- **Bağlantı adresini (connection string)** kopyala ve kaydet.

### 5. Alan adı (opsiyonel)
- Vercel ücretsiz bir `*.vercel.app` adresi veriyor; v1 için bu yeterlidir.
- Kendi alan adını almak istersen şimdi al, ama zorunlu değil.

---

## Bittiğinde elinde şunlar olacak

```
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
DATABASE_URL=...
GitHub depo adresi: ...
```

Bu değerleri T01'e başlarken hazır bulundur. **Bunları sohbete yapıştırma** — T01'de
`.env.local` dosyasına kendin gireceksin.

---

## Kabul kriteri

- [ ] iyzico sandbox paneline giriş yapabiliyorum ve API anahtarlarım elimde
- [ ] Vercel hesabım var
- [ ] Boş bir GitHub deposu var
- [ ] Postgres bağlantı adresim elimde
