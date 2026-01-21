import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function connectWS() {
  return io(BACKEND_URL);
}
