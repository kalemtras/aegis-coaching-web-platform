Evet, doğru. Önceki özetimde o kısmı fazla kısalttım. "Dashboard sadece render eder" derken **dashboard componentinin görevi** açısından söyledim; ama sistem akışının başlangıcı web'den gelecek. Tam akış şöyle olmalı:

```
                 WEB APP
                    |
                    |
        Athlete oluştur / güncelle
                    |
                    v
          Athlete Profile Payload
                    |
                    v
              AEGIS ENGINE API
                    |
        +-----------+------------+
        |                        |
        v                        v
  Athlete Context          Activity History
        |                        |
        +-----------+------------+
                    |
                    v
          Pipeline Orchestrator
                    |
        +-----------+------------+
        |                        |
        v                        v
   Physiology              Fitness Models
 (FTP/VO2/CSS)        (CTL/ATL/TSB/Ramp)
        |
        v
 Adaptation / Recovery
        |
        v
 Planning Engine
        |
        v
 Workout Generation
                    |
                    v
              ENGINE RESPONSE
                    |
                    v
                 WEB APP
                    |
                    v
              Dashboard render
```

Yani:

## 1. Sporcu oluşturma aşaması

Web'deki onboarding:

```text
Name
Age
Weight
FTP
VO2max
CSS
Threshold pace
Resting HR
Goal race
Target time
Race date
```

bunları toplar.

Sonra:

```http
POST /athletes
```

veya:

```http
POST /engine/initialize-athlete
```

gibi bir endpoint'e gönderir.

Örneğin:

```json
{
  "name":"aslı",
  "age":31,
  "weightKg":61,
  "ftp":210,
  "vo2max":52,
  "swimCss":95,
  "thresholdPaceSecPerKm":300,
  "goal":{
    "race":"half",
    "target":"5:30:00",
    "date":"2026-09-15"
  }
}
```

---

## 2. Motor tarafı

Aegis bunu alır:

```text
AthleteContext oluştur
```

sonra kendi pipeline'ını çalıştırır:

* fizyoloji
* fitness
* recovery
* adaptation
* planning

---

## 3. Motor çıktıyı web'e verir

Örneğin:

```json
{
 "athlete":{
   "name":"aslı"
 },

 "metrics":{
   "ctl":73,
   "atl":67,
   "tsb":6,
   "rampRate":-3.9
 },

 "race":{
   "readiness":82,
   "prediction":"5:24:00",
   "gap":"-00:06:00"
 },

 "plan":{
   "currentPhase":"Build",
   "weeklyHours":9.5
 }
}
```

---

## 4. Dashboard

Artık hiçbir hesap yapmaz:

Yanlış:

```ts
const ctl = calculateCTL(workouts)
```

Doğru:

```ts
const {ctl, atl, tsb} = dashboard.metrics
```

Render eder.

---

Yani senin düzeltmen önemli:

> "Motor veriyi ilk web'den alacak."

Kesinlikle.

Sistem:

**Web → Engine → Web**

döngüsü.

Sadece Dashboard özelinde:

**Engine → Dashboard render**

oluyor.

Bu ayrımı bundan sonra koruyalım.

Bir de mimari açıdan önemli bir nokta: onboarding'de girilen ilk athlete verisi ile motorun sonraki state'i aynı şey olmayacak. İlk gönderilen:

* başlangıç profili
* hedef
* mevcut kapasite

olacak.

Sonrasında motor kendi state'ini oluşturacak:

* fitness state
* fatigue state
* adaptation state
* training history

ve web her açılışta o güncel state'i çekecek.

Bu, Aegis'in anlattığın pipeline yapısıyla uyumlu.
