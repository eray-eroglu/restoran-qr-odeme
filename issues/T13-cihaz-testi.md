# T13 — Gerçek cihaz testi ve cila

**Bloklayan:** T09, T10, T11, T12
**Kim yapar:** Ajan + **sen** (asıl test senin)
**Referans:** PRODUCT.md bölüm 2 (başarı kriteri); CONTEXT.md D16

---

## Amaç

Arkadaş testinden **önce** kendi elinde çalıştığından emin olmak.

---

## Kapsam

**1. Çoklu cihaz provası**
Elindeki tüm telefon/tarayıcılarla (en az 3 ayrı oturum) bir masayı baştan sona bölüşüp öde.
Üç modu da ayrı ayrı dene.

**2. Gerçek koşullar**
- Yavaş bağlantıda dene (mobil veri, wifi kapalı)
- Ekranı kilitleyip 2 dakika sonra geri dön (R7 kilit düşmesi)
- 3D ekranında geri tuşuna bas, tarayıcıyı kapat (R8)
- 12 kalemlik uzun bir adisyonla dene — ana butonlar kayboluyor mu?

**3. Cila**
- Wireframe'lere göre eksik kalan görsel düzenlemeler
- Tüm metinlerin tek dosyada olduğunu doğrula (D27)
- Tutarların her yerde aynı biçimde gösterildiğini doğrula (`1.960,00 TL`)

**4. Arkadaş testi hazırlığı**
- iyzico test kartı numarasını okunaklı bir yerde hazır bulundur
- Masaya koyacağın QR'ı hazırla (kâğıda basılı veya ekranda)
- **Kısa anket:** 3-4 soru. "Takıldığın yer oldu mu?", "Tekrar kullanır mıydın?",
  "Anlamadığın bir şey oldu mu?"
- Test sırasında **yardım etme ve konuşma** — başarı kriteri "yardımsız" tamamlanması

---

## Kabul kriterleri

- [ ] Üç mod da 3 ayrı cihazla uçtan uca çalışıyor
- [ ] Yavaş bağlantıda kullanılabilir
- [ ] Uzun adisyonda ana butonlar erişilebilir kalıyor
- [ ] Hiçbir denemede masa takılı kalmadı
- [ ] Test kartı, QR ve anket hazır
