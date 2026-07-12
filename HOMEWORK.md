# Your Homework — things only you can do

A running checklist of tasks that need your accounts, devices, or a human hand —
the stuff I can't do from code. Check them off as you go. Ordered roughly by
urgency (long-lead items first).

Details for the Android items live in `ANDROID_SETUP_GUIDE.md`.

---

## 🔴 Long-lead — start ASAP (external approval delays)

- [ ] **Google Play Developer account** — $25 one-time + identity verification
      (hours to days to approve). Nothing Android ships until this clears.
      → https://play.google.com/console/signup  (choose **Personal** account)
- [ ] **Line up ~20 test users** (friends/family/gym buddies with Android phones)
      for the mandatory **closed test (14+ continuous days)** Google requires of
      new personal accounts before public launch. You don't need them yet — just
      know who they'll be. This is the sneakiest deadline risk.

## 🟠 Setup — needed before the payment spike & native build

- [ ] **Install Android Studio** (bundles JDK + Android SDK + `adb`) — ~1 GB.
      → https://developer.android.com/studio  (accept default components)
      Then verify: `java -version` and `adb version` both print a version.
- [ ] **Create a RevenueCat account** (free) — configure later once Play is live.
      → https://www.revenuecat.com
- [ ] **Put your Samsung phone in developer mode** (Settings → About phone →
      Software info → tap Build number 7×), enable **USB debugging**, plug in,
      and confirm `adb devices` lists it.

## 🟡 Testing & data — quick, do soon

- [ ] **Test account deletion** with a THROWAWAY account (⚠️ not your real one):
      sign up with a test email → add a workout → Settings → Data → **Delete
      Account** → confirm you land back on sign-in and the data is gone. If it
      errors, check the `delete-account` function logs in the Supabase dashboard.
- [ ] **Re-enter your weight** in Settings *if your profile is set to metric* —
      the weight bug fix changed storage to canonical pounds, and old metric rows
      held the kg number mislabeled as lbs. (Skip if you use imperial/lbs.)

---

## Done / superseded
_(move items here as you finish them so the active list stays short)_
