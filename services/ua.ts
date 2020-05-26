export type OS = "unknown" | "ios" | "android" | "desktop";

let cachedOS: OS = "unknown";

export function userAgent(): string {
  if ('navigator' in globalThis) return navigator.userAgent;
  return "";
}

function computeOS(): OS {
  const ua = userAgent();
  if (!ua) return "unknown";

  if (/iphone|ipad/i.test(ua)) {
    return "ios";
  }

  if (/mobile/i.test(ua)) {
    return "android";
  }

  return "desktop";
}

export function os(): OS {
  if (cachedOS === "unknown") {
    cachedOS = computeOS();
  }
  return cachedOS;
}
