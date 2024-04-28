import useSocketManager from "@app/hooks/useSocketManager";
import { ClientEvents } from "@shared/client/ClientEvents";
import { ServerEvents } from "@shared/server/ServerEvents";
import { useEffect } from "react";
import { Listener } from "../websocket/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";

export default function Test() {
  const {sm} = useSocketManager();
  useEffect(() => {
    sm.connect();
    const onPong: Listener<ServerPayloads[ServerEvents.Pong]> = (data) => {
      console.log(data.message);
    }
    sm.registerListener(ServerEvents.Pong, onPong);
    return () => {
      sm.removeListener(ServerEvents.Pong, onPong);
    }
  }, []);
  const ping = () => {
    sm.emit({ event: ClientEvents.Ping} )
  }
  return (
    <div>
      <button onClick={ping}>Ping</button>
    </div>
  )
}