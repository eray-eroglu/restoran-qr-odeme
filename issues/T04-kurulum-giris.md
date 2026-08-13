# T04 — Kurulum: şifre girişi (E7)

**Bloklayan:** T01
**Referans:** PRODUCT.md E7; CONTEXT.md D26

---

## Amaç

Kurulum ekranlarını tek bir ortak şifreyle koru.

## Neden gerekli

Kurulum ekranı, arkadaşlarının bağlandığı **aynı sitede** duruyor. Adresini gören biri masa
silebilir, hesap kapatabilir. Sen bu ekranı testte onların yanında açacaksın.

---

## Kapsam

- `/kurulum` altındaki tüm sayfalar korumalı
- Tek alanlı şifre ekranı; şifre ortam değişkeninde (`KURULUM_SIFRE`)
- Giriş yapıldığında oturum çerezde tutulur, tarayıcı kapanana kadar geçerli

## Kapsam dışı

Kullanıcı hesabı, kayıt, parola sıfırlama, roller. **Hiçbiri yok.**

---

## Kabul kriterleri

- [ ] Şifresiz `/kurulum` adresine gidince şifre ekranı çıkıyor
- [ ] Doğru şifreyle giriliyor, yanlış şifre reddediliyor
- [ ] Şifre kodda değil, ortam değişkeninde
- [ ] Müşteri tarafı (`/m/<token>`) bu korumadan **etkilenmiyor**
