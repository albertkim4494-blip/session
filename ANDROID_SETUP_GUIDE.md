# Android Setup Guide — accounts & tooling

A step-by-step checklist to unblock the RevenueCat payment spike and, later, the
Android launch. This is **your homework** — most of it is account creation and
software installs that only you can do (they need your identity, payment, and
your physical phone). Work through it at your own pace.

Companion to `APP_STORE_ROADMAP.md` (Phase 0 → Phase 3).

---

## The big picture

You're setting up four things. **Order matters** — the first one has an approval
delay outside your control, so start it today.

| # | Thing | Cost | Time / delay | Why |
|---|---|---|---|---|
| 1 | Google Play Developer account | **$25** one-time | Sign-up ~30 min, **approval hours–days** | Required to publish anything to Play + to sell subscriptions |
| 2 | Android Studio (+ JDK, SDK, adb) | Free | ~1 hr download+install | Builds the native Android app on your PC |
| 3 | RevenueCat account | Free | ~10 min | Handles billing so you don't write raw Play Billing code |
| 4 | Your Samsung phone in developer mode | Free | ~10 min | Where we test a real purchase |

> ⚠️ **The single most important thing to start now:** #1. New personal Google
> Play accounts must also complete a **closed test** (see the box in Part 1)
> before they're allowed to publish publicly — and that has a **14-day minimum**.
> The clock only starts once your account is approved, so the sooner it's in the
> queue, the more slack you have for a January launch.

---

## Part 1 — Google Play Developer account (do this first)

1. Go to **https://play.google.com/console/signup**
2. Sign in with the Google account you want to *own the app* (use one you'll keep
   long-term — this becomes your developer identity; hard to change later).
3. Choose account type: **Personal** (an "Organization" account needs a D-U-N-S
   business number and more paperwork — you don't need that as a solo dev).
4. Pay the **$25 one-time** registration fee.
5. Complete **identity verification** — Google will ask for your legal name,
   address, and a government ID. This is the step that can take hours to a couple
   of days to approve. You can't skip it.
6. Wait for the "your account is ready" email before relying on it.

> 📋 **The closed-testing requirement (read this now, act on it in November).**
> Google requires new personal developer accounts to run a **closed test with at
> least 20 testers who stay opted-in for 14+ continuous days** before you can
> apply for production (public) access. Practical implications:
> - Start a list *now* of 20 people (friends, gym buddies, family) with Android
>   phones who'll install a test build and leave it on their phone for 2 weeks.
> - This is why the roadmap starts the test track in **Phase 4 (November)**, not
>   December. If you wait until December, you cannot launch by January 1.
> - You don't need the testers yet — just know you'll need them and who they are.

**✅ Checkpoint:** you get the email confirming the developer account is active.

---

## Part 2 — Android Studio (installs the build toolchain)

Android Studio bundles everything the native build needs: a Java JDK, the Android
SDK, and `adb` (the tool that talks to your phone). One install covers it.

1. Download from **https://developer.android.com/studio** (~1 GB).
   - Tip: you can open this from within our session by typing
     `!start https://developer.android.com/studio` in the prompt.
2. Run the installer. **Accept the defaults** — in particular let it install the
   "Android SDK", "SDK Platform", and "Android Virtual Device" components.
3. Launch Android Studio once and let it finish downloading SDK components (the
   first-run "Setup Wizard" does this automatically). You can then close it.
4. **Verify the install.** In the prompt, run each of these (the `!` runs it in
   this session so I can see the output too):
   - `!java -version` — should print a version (e.g. `openjdk 17...` or `21...`).
     If "not recognized", see the env-var note below.
   - `!adb version` — should print "Android Debug Bridge version ...".

> 🔧 **If `java`/`adb` aren't recognized** (common on a fresh install), Windows
> needs a couple of environment variables. We can set these together when we do
> the native wiring, but if you want them now (Windows 11):
> - Search Start menu → **"Edit the system environment variables"** → *Environment
>   Variables…*
> - Under **User variables**, add:
>   - `ANDROID_HOME` = `C:\Users\themi\AppData\Local\Android\Sdk`
>   - `JAVA_HOME` = the Android Studio JBR path, usually
>     `C:\Program Files\Android\Android Studio\jbr`
> - Edit the `Path` variable and add:
>   - `%ANDROID_HOME%\platform-tools`
>   - `%JAVA_HOME%\bin`
> - Open a **new** terminal and re-run the two verify commands.

**✅ Checkpoint:** `java -version` and `adb version` both print a version.

---

## Part 3 — RevenueCat account (quick; configure later)

1. Sign up at **https://www.revenuecat.com** (free tier is plenty — no billing
   until you're earning real money).
2. That's it for now. We can't fully configure it until your Play account (Part 1)
   is approved, because RevenueCat links to your Play app and its products.
3. When we're ready, you'll: create a "Project", add the Android app, and paste a
   RevenueCat **public API key** into the app. I'll walk you through it.

**✅ Checkpoint:** you can log into the RevenueCat dashboard.

---

## Part 4 — Put your Samsung phone in developer mode

This lets your PC install our test build directly onto the phone over USB.

1. On the phone: **Settings → About phone → Software information**.
2. Tap **"Build number" seven times** until it says "You're now a developer."
3. Go back to **Settings → Developer options** (now visible).
4. Turn on **USB debugging**.
5. Plug the phone into your PC with a USB cable. On the phone, tap **Allow** when
   it asks "Allow USB debugging from this computer?" (check "always allow").
6. Verify from the prompt: `!adb devices` — your phone should appear in the list
   (as something like `R5CN...   device`). If it says "unauthorized", re-check the
   Allow prompt on the phone.

> 🔌 If the phone doesn't show up at all, Windows may need the **Samsung USB
> driver** — search "Samsung Android USB driver" on Samsung's developer site, or
> install "Samsung Smart Switch" which bundles it.

**✅ Checkpoint:** `adb devices` lists your phone as `device` (not `unauthorized`).

---

## When you're done — tell me

Once you can check these boxes, ping me and we'll do the native wiring together
(stand up the Capacitor Android shell, add the RevenueCat plugin, make a test
subscription, and run a real purchase on your phone):

- [ ] Google Play Developer account **approved** (Part 1)
- [ ] `java -version` and `adb version` both work (Part 2)
- [ ] RevenueCat account created (Part 3)
- [ ] `adb devices` shows your Samsung phone (Part 4)

You don't have to finish all four before we continue — the moment **Part 2**
(Android Studio) is done, we can already build the app onto your phone and test
the Pro dev-toggle in the real native shell, even before billing is wired. Part 1
is the only true long-pole for the *paid* purchase test.

---

## What happens next (so you know where this is going)

Once the above is ready, the remaining spike is roughly:

1. `npm i @capacitor/core @capacitor/cli && npx cap init` — add Capacitor.
2. `npm i @capacitor/android && npx cap add android` — generate the Android project.
3. `npm run build && npx cap sync` — copy the web build into the native shell.
4. `npx cap run android` — launch it on your phone.
5. Add `@revenuecat/purchases-capacitor`, paste the RevenueCat key, define a
   `pro` entitlement + a test subscription in Play Console + RevenueCat.
6. Buy it on your phone with a **license-tester** account (no real charge), and
   watch the app flip `isPro` to true through RevenueCat instead of the dev toggle.

That last step is the whole point of the spike: proving the money-to-unlock path
works end-to-end before we build the real paywall in Phase 3.
