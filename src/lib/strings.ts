// All user-visible copy lives here. Never inline strings in components.
// Rule: if it's on screen, it's in strings.ts.

export const strings = {
  app: {
    name: 'Restaurant QR Payment',
    tagline: 'Restaurant QR Payment — v1',
  },

  // E1 — Bill screen
  bill: {
    noOpenBill: 'Bu masada şu anda açık bir hesap yok.',
    askServer: 'Garsona sorabilirsiniz.',
    tablePrefix: 'Masa',
    billLabel: 'ADİSYON',
    totalRow: 'Toplam',
    itemCount: (n: number) => `${n} kalem`,
    noPaiment: 'henüz ödeme yok',
    howToPay: 'Nasıl ödüyorsunuz?',
    amountLabel: 'Ödenecek',
    payFull: 'Hesabın tamamını öde',
    splitEqual: 'Eşit böl',
    selectItems: 'Kendi ürünlerimi seç',
    totalLabel: 'HESAP TUTARI',
    remainingLabel: 'KALAN',
    progressPaid: (n: number, total: number) => `${total} payın ${n}'i ödendi`,
    progressRemaining: (amount: string) => `kalan ${amount}`,
    payMyShare: 'Payımı öde',
    payRest: 'Kalanı ben ödeyeyim',
    modeSelected: 'eşit böl modu seçildi · değiştirilemez',
    equalSplitMode: (n: number) => `eşit böl · ${n} kişi`,
  },

  // E2 — Equal split person count
  split: {
    label: 'KİŞİ BAŞI',
    question: 'Masada kaç kişisiniz?',
    hint: 'Bu sayıyı ilk kişi belirler. İlk ödemeden sonra kişi sayısı ve mod değiştirilemez.',
    billTotal: 'Hesap toplamı',
    paid: 'Ödenen',
    continue: (amount: string) => `Devam · payım ${amount}`,
    calculation: (total: string, n: number) => `${total} ÷ ${n} kişi`,
  },

  // E3 — Item selection
  items: {
    label: 'SEÇTİĞİN TUTAR',
    hint: (remaining: string) => `Ödeyeceğin ürünlere dokun · kalan ${remaining}`,
    selectionHint: (n: number) => `${n} ürün seçtin · dokunarak geri alabilirsin`,
    stateMyChoice: 'senin seçimin',
    statePaid: 'ödendi',
    stateSelectedByOther: 'seçildi',
    stateJustSelected: 'az önce seçildi',
    conflictTitle: 'Bu ürünü az önce başkası seçti.',
    conflictSub: (name: string) => `${name} · başka bir ürün seçebilirsin.`,
    payDisabled: 'Öde',
    pay: (amount: string) => `Öde · ${amount}`,
  },

  // E4 — Payment
  payment: {
    back: '‹ Geri',
    label: 'ÖDENECEK',
    items: (n: number) => `${n} ürün`,
    noTip: 'bahşiş yok',
    tipQuestion: 'Bahşiş eklemek ister misiniz?',
    tipOptional: '(isteğe bağlı)',
    tipLabel: 'Bahşiş',
    tipNone: 'Yok',
    tip5: '%5',
    tip10: '%10',
    tip15: '%15',
    cardLabel: 'KART BİLGİSİ',
    cardNumber: 'Kart numarası',
    expiry: 'AA/YY',
    cvc: 'CVC',
    billShare: 'Hesap payı',
    pay: (amount: string) => `Öde · ${amount}`,
    secureNote: 'Sonraki adımda bankanızın 3D Secure sayfası açılır.',
    redirecting: 'Bankanıza yönlendiriliyorsunuz',
    redirectAmount: (amount: string, table: string) => `${amount} · ${table}`,
    doNotClose: 'Bu sayfayı kapatmayın.',
  },

  // E5 — Payment result
  result: {
    successLabel: 'ÖDEME ALINDI',
    failTitle: 'Ödeme tamamlanamadı',
    failDesc: 'Bankanız işlemi onaylamadı. Hesabınızdan para çekilmedi.',
    failNote: 'Seçtiğin ürünler serbest bırakıldı — tekrar denemeden önce başkası seçmiş olabilir.',
    billShare: 'Hesap payı',
    tip: (pct: number) => `Bahşiş (%${pct})`,
    table: 'Masa',
    date: 'Tarih',
    txNo: 'İşlem no',
    paidItemsLabel: 'ÖDEDİĞİNİN ÜRÜNLERİ',
    tableStatus: (remaining: string, count: number) =>
      `Masanın durumu: kalan ${remaining} · ${count} kişi henüz ödemedi`,
    receiptNote: 'Bu makbuzun adresi kalıcıdır — ekran görüntüsü alabilir veya linki saklayabilirsiniz.',
    backToBill: 'Hesaba dön',
    retry: 'Tekrar dene',
    triedAmount: 'Denenen tutar',
  },

  // E6 — Table closed
  closed: {
    remainingLabel: 'MASA · KALAN',
    zeroAmount: '0,00 TL',
    closedMessage: 'Hesabın tamamı ödendi.',
    hint: 'Bu masa kapandı. Yeni hesap açılana kadar QR bu ekranı gösterir.',
    billTotal: 'Hesap toplamı',
    totalPaid: 'Ödenen',
    tip: 'Bahşiş',
    yourPayment: 'SENİN ÖDEMENİ',
    receipt: (amount: string) => `Makbuzu gör · ${amount}`,
    farewell: 'Afiyet olsun.',
  },

  // Admin
  admin: {
    password: {
      title: 'Yönetim Paneli',
      placeholder: 'Şifre',
      enter: 'Giriş',
      wrong: 'Yanlış şifre.',
    },
    tables: {
      title: 'Masalar',
      newTable: 'Masa oluştur',
      newBill: 'Adisyon aç',
      colTable: 'Masa',
      colTotal: 'Toplam',
      colPaid: 'Ödenen',
      colRemaining: 'Kalan',
      colMode: 'Mod',
      colActions: 'İşlemler',
      noTables: 'Henüz masa yok.',
      statusOpen: 'açık',
      statusClosed: 'kapalı',
      statusNoBill: '—',
    },
    tableDetail: {
      menu: 'Menü',
      qr: 'QR Kodu',
      breakdown: 'Döküm',
      openBill: 'Adisyon Aç',
      closeBill: 'Hesabı Kapat',
      addItem: 'Kalem Ekle',
    },
  },
}

// Currency helpers — Turkish format: 1.960,00 TL
export function formatTL(amount: number): string {
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL'
}

export function formatTLNoUnit(amount: number): string {
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Date helper — Turkish format: 13.08.2026 · 21:14
export function formatDateTime(date: Date): string {
  const d = date.toLocaleDateString('tr-TR')
  const t = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  return `${d} · ${t}`
}
