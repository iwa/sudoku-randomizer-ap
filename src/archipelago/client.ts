import { Client } from "archipelago.js";

export const apClient = new Client();

export async function connectToAP(
  server: string,
  slot: string,
  password?: string,
) {
  await apClient.login(server, slot, "SudokuRando", {
    password: password,
  });
}

export function disconnectFromAP() {
  apClient.socket.disconnect();
}

export function isConnected(): boolean {
  return apClient.authenticated;
}

export function getSlotName(): string {
  return apClient.name;
}

export function sendLocationCheck(locationId: number) {
  apClient.check(locationId);
}
