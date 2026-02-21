import { Client } from "archipelago.js";

export const apClient = new Client();

export async function connectToAP(
  server: string,
  slot: string,
  password?: string,
) {
  try {
    await apClient.login(server, slot, "SudokuRandoAP", {
      password: password,
    });
    console.log("Connected to Archipelago server!");
  } catch (err) {
    console.error("Failed to connect to Archipelago server:", err);
  }
}

export function sendLocationCheck(locationId: number) {
  apClient.check(locationId);
}
