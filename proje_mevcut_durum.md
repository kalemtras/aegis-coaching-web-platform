Güzel noktaya geldik. Şu ana kadar yaptığımız şey aslında projenin **mock demo seviyesinden gerçek kullanıcı akışına geçişinin ilk adımıydı**.

Aşağıdaki metni kopyalayıp saklarsan, başka bir sohbette bana verdiğinde kaldığımız yeri anlayabilirim.

---

# APEX Triathlon Coaching Platform — Proje Bağlamı / Devam Notu

## Projenin amacı

Next.js + TypeScript tabanlı bir triathlon coaching platformu geliştiriyoruz.

Hedef:

* Kullanıcı kendi atlet bilgilerini girecek.
* Sistem bu bilgileri saklayacak.
* Coaching engine bu verilere göre:

  * yarış tahmini,
  * hedef analizi,
  * antrenman planı,
  * fitness/fatigue/form takibi
    üretecek.

Uzun vadede mock data yerine gerçek kullanıcı verisi ve gerçek adaptif coaching engine bağlanacak.

---

# Şu ana kadar yapılanlar

## 1) Engine yapısı düzenlendi

Eski:

```
lib/engine.ts
```

yeniden düzenlendi.

Yeni yapı:

```
lib/
 ├─ engine/
 │   ├─ index.ts
 │   ├─ race-predictor.ts
 │   ├─ projection-model.ts
 │   ├─ athlete-model.ts
 │   ├─ load-model.ts
 │   ├─ fatigue-model.ts
 │   └─ diğer engine dosyaları
 │
 └─ legacy-engine.ts
```

Amaç:

* Eski çalışan fonksiyonları bozmamak.
* Yeni engine modüllerini ekleyebilmek.
* UI'ın tek interface üzerinden çalışması.

Build şu anda başarılı:

```
npm run build

✓ Compiled successfully
✓ TypeScript validation
✓ Static generation
```

---

# 2) Projection sistemi düzeltildi

Race prediction tarafında:

`race-predictor.ts`

şu çıktıyı üretiyor:

```ts
{
 swim,
 bike,
 run,
 transitions,
 total,
 splits:[]
}
```

Projection modeli:

```ts
Projection
```

şunları içeriyor:

* predicted
* targetSeconds
* gapSeconds
* achievable
* breakdown
* weeksToRace
* requiredWeeklyGainSec

---

# 3) Onboarding gerçek kullanıcı kaydetmeye başladı

Önceden:

Onboarding sadece preview yapıyordu.

Şimdi:

```
Onboarding
    |
    ↓
saveAthlete()
    |
    ↓
localStorage
```

ile kullanıcı kaydediliyor.

Yeni dosya:

```
lib/store.ts
```

içinde:

```ts
saveAthlete()
getAthlete()

saveGoals()
getGoals()
```

var.

---

# 4) Dashboard artık gerçek athlete verisi okuyabiliyor

Önceden:

```
mock-data.ts
   |
   ↓
Dashboard
```

idi.

Şimdi:

```
Onboarding
   |
   ↓
localStorage
   |
   ↓
Dashboard
```

çalışıyor.

Test edildi:

Yeni kullanıcı:

```
Test Athlete
FTP 300
VO2 max 60
```

girildi.

Dashboard kartı değişti.

---

# 5) Sidebar/AppShell gerçek kullanıcıya bağlandı

Sorun:

Dashboard değişiyordu ama sol alt kullanıcı bilgisi refresh olmadan değişmiyordu.

Sebep:

`storage` event aynı sekmede çalışmıyordu.

Çözüm:

custom browser event eklendi.

`store.ts`

içinde:

```ts
window.dispatchEvent(
 new Event('athlete-updated')
)
```

eklendi.

`app-shell.tsx`

şunu dinliyor:

```ts
window.addEventListener(
 'athlete-updated',
 refreshAthlete
)
```

Sonuç:

Artık:

* Dashboard kartı
* Sidebar kullanıcı bilgisi

aynı anda değişiyor.

---

# Şu anki durum

Çalışan akış:

```
Kullanıcı
   |
   ↓
Onboarding formu
   |
   ↓
saveAthlete()
   |
   ↓
localStorage
   |
   ↓
Dashboard
   |
   ↓
Sidebar
```

---

# Hala mock olan bölgeler

Şu anda sadece athlete bilgisi gerçek kullanıcıdan geliyor.

Bunlar hala mock-data kullanıyor:

## 1) Goals

Dosyalar:

```
lib/mock-data.ts
app/goals
```

Yapılacak:

```
saveGoals()
getGoals()
```

ile gerçek kullanıcı hedeflerine bağlamak.

---

## 2) Workouts

Şu anda:

```
mock workouts
```

kullanılıyor.

İleride:

engine üretmeli:

```
Athlete
+
Goal
+
Fitness state

↓

Workout plan
```

---

## 3) Fitness metrics

Şu anda:

```
CTL
ATL
TSB
```

mock.

Sonra gerçek engine hesaplayacak.

---

# Bundan sonraki plan

## Aşama 1 — Kullanıcı state temizliği

Amaç:

mock-data bağımlılığını azaltmak.

Sırayla:

1. Goals gerçek store'a bağlanacak.
2. Dashboard race bilgisi gerçek goal'dan okuyacak.
3. Sidebar tamamen gerçek kullanıcıdan gelecek.

---

## Aşama 2 — Engine entegrasyonu

Gerçek coaching mantığı:

Input:

```
Athlete
Goal
Training history
Completed workouts
```

Output:

```
Race prediction
Weekly plan
Adaptation
Fatigue adjustment
```

---

## Aşama 3 — Database

Şu an:

```
localStorage
```

kullanılıyor.

Sonra:

* Supabase/Postgres
  veya
* başka backend

bağlanacak.

---

# Önemli dosyalar

Ana dosyalar:

```
app/page.tsx
app/onboarding/page.tsx

components/app-shell.tsx
components/projection-card.tsx

lib/mock-data.ts
lib/store.ts

lib/engine/index.ts
lib/engine/race-predictor.ts
lib/engine/projection-model.ts

lib/legacy-engine.ts
```

---

# Son kaldığımız nokta

Son yapılan değişiklik:

`app-shell.tsx`

içinde athlete state artık:

```ts
activeAthlete
```

ile yönetiliyor.

`lib/store.ts`

içinde:

```ts
athlete-updated
```

event'i var.

Test sonucu:

✅ Dashboard kartı değişiyor
✅ Sidebar aynı anda değişiyor
✅ Build yeşil

Bir sonraki iş:

**Goals sistemini mock-data'dan çıkarıp gerçek kullanıcı store'una bağlamak.**

---

Bu metinle yeni sohbette devam edersek doğrudan buradan ilerleyebiliriz.
