import { Client } from "archipelago.js";

export const apClient = new Client();

export function connectToAP(server: string, slot: string, password?: string) {
  return apClient.login(server, slot, "SudokuRandoAP", {
    password: password,
  });
}

export function sendLocationCheck(locationId: number) {
  apClient.check(locationId);
}
