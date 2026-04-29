import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export type PushPayload = {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};

export async function sendPushNotification(payload: PushPayload): Promise<void> {
  const app = getAdminApp();
  const messaging = getMessaging(app);
  await messaging.send({
    token: payload.token,
    notification: { title: payload.title, body: payload.body },
    data: payload.data ?? {},
    webpush: {
      notification: {
        title: payload.title,
        body: payload.body,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        requireInteraction: true,
      },
      fcmOptions: {
        link: payload.data?.buyerId ? `/buyers/${payload.data.buyerId}` : "/today",
      },
    },
  });
}

export function isInvalidTokenError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("registration-token-not-registered") ||
      msg.includes("invalid-registration-token") ||
      msg.includes("mismatched-credential")
    );
  }
  return false;
}
