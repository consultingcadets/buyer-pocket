import { PushNotifications } from "@capacitor/push-notifications";
import { savePushToken } from "@/app/(app)/reminders/actions";

export async function registerNativePush(): Promise<void> {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return;

  await PushNotifications.register();

  PushNotifications.addListener("registration", async ({ value: token }) => {
    await savePushToken(token, "mobile", "native");
  });
}
