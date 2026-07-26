/**
 * billing.js — thin wrapper around the RevenueCat Capacitor plugin.
 *
 * Phase 0 SPIKE (see APP_STORE_ROADMAP.md): prove the billing pipe end-to-end
 * on a real device before it's on the Phase 3 critical path. RevenueCat's `pro`
 * entitlement is the source of truth for Pro; callers sync the boolean result
 * into `state.preferences.isPro` so the rest of the app keeps reading through
 * `isPro(state)` in entitlements.js unchanged.
 *
 * Everything here is NATIVE-ONLY. Off native (web dev/PWA) every function is a
 * safe no-op and the plugin is never imported — the dynamic `import()` mirrors
 * the back-button effect in App.jsx so the web bundle never pulls in native code.
 */
import { Capacitor } from "@capacitor/core";

// RevenueCat entitlement identifier configured in the RC dashboard.
export const PRO_ENTITLEMENT = "pro";

// Public Android SDK key (goog_…). Public, not a secret — public SDK keys ship
// in the app. Baked at build time via Vite env; missing key => billing stays off.
const RC_ANDROID_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY;

let configured = false;

/** True only when we're in the native Capacitor shell with a key present. */
function billingAvailable() {
  return Capacitor.isNativePlatform() && !!RC_ANDROID_KEY;
}

/** Lazy-load the plugin (native only). */
async function loadPurchases() {
  const mod = await import("@revenuecat/purchases-capacitor");
  return mod;
}

/** True if the given CustomerInfo has the `pro` entitlement active. */
function proFromCustomerInfo(customerInfo) {
  return !!customerInfo?.entitlements?.active?.[PRO_ENTITLEMENT];
}

/**
 * Configure RevenueCat once, on native startup. No-op off native or without a key.
 * @param {string} appUserID - the Supabase user id, so entitlements follow the
 *   account across devices (instead of an anonymous RC id).
 * @returns {Promise<boolean>} whether billing was configured.
 */
export async function initBilling(appUserID) {
  if (!billingAvailable() || configured) return configured;
  try {
    const { Purchases, LOG_LEVEL } = await loadPurchases();
    // DEBUG logging is spike-only; drop to INFO for release in Phase 3.
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: RC_ANDROID_KEY, appUserID: appUserID || null });
    configured = true;
    console.log("[billing] RevenueCat configured for", appUserID || "(anonymous)");
  } catch (e) {
    console.warn("[billing] configure failed", e);
  }
  return configured;
}

/**
 * Register a listener that fires whenever RevenueCat's CustomerInfo changes
 * (purchase, renewal, expiration, restore on another device). Calls back with
 * the current `pro` boolean. No-op off native.
 * @param {(isPro: boolean) => void} onChange
 * @returns {Promise<() => void>} an unsubscribe function (always safe to call).
 */
export async function addProListener(onChange) {
  if (!billingAvailable()) return () => {};
  try {
    const { Purchases } = await loadPurchases();
    await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      onChange(proFromCustomerInfo(customerInfo));
    });
    // The plugin has no removeListener for this callback in the current API;
    // returning a no-op keeps the caller's cleanup contract simple.
    return () => {};
  } catch (e) {
    console.warn("[billing] addProListener failed", e);
    return () => {};
  }
}

/**
 * Read the current entitlement state from RevenueCat.
 * @returns {Promise<boolean>} whether `pro` is active (false off native/on error).
 */
export async function getIsPro() {
  if (!billingAvailable() || !configured) return false;
  try {
    const { Purchases } = await loadPurchases();
    const { customerInfo } = await Purchases.getCustomerInfo();
    return proFromCustomerInfo(customerInfo);
  } catch (e) {
    console.warn("[billing] getCustomerInfo failed", e);
    return false;
  }
}

/**
 * Fetch the current Offering's packages for the paywall.
 * @returns {Promise<{monthly: object|null, annual: object|null, packages: object[]}>}
 */
export async function getProOffering() {
  const empty = { monthly: null, annual: null, packages: [] };
  if (!billingAvailable() || !configured) return empty;
  try {
    const { Purchases } = await loadPurchases();
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    if (!current) return empty;
    return {
      monthly: current.monthly || null,
      annual: current.annual || null,
      packages: current.availablePackages || [],
    };
  } catch (e) {
    console.warn("[billing] getOfferings failed", e);
    return empty;
  }
}

/**
 * Purchase a package. Resolves to whether `pro` is active afterward.
 * A user cancellation resolves to the current (unchanged) pro state, not a throw
 * to the UI — callers can treat `false` as "not upgraded".
 * @param {object} pkg - a PurchasesPackage from getProOffering().
 * @returns {Promise<{ok: boolean, isPro: boolean, cancelled: boolean, error?: string}>}
 */
export async function purchasePro(pkg) {
  if (!billingAvailable() || !configured || !pkg) {
    return { ok: false, isPro: false, cancelled: false, error: "billing unavailable" };
  }
  try {
    const { Purchases } = await loadPurchases();
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { ok: true, isPro: proFromCustomerInfo(customerInfo), cancelled: false };
  } catch (e) {
    // RevenueCat surfaces user cancellation via userCancelled on the error.
    const cancelled = !!(e && (e.userCancelled || e.code === "1" || e.code === 1));
    if (!cancelled) console.warn("[billing] purchase failed", e);
    return { ok: false, isPro: false, cancelled, error: cancelled ? undefined : String(e?.message || e) };
  }
}

/**
 * Restore prior purchases (e.g. reinstall / new device).
 * @returns {Promise<boolean>} whether `pro` is active after restore.
 */
export async function restorePro() {
  if (!billingAvailable() || !configured) return false;
  try {
    const { Purchases } = await loadPurchases();
    const { customerInfo } = await Purchases.restorePurchases();
    return proFromCustomerInfo(customerInfo);
  } catch (e) {
    console.warn("[billing] restore failed", e);
    return false;
  }
}
