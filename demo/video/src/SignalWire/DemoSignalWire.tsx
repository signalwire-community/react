import {
  Call,
  useSignalWire,
  useAddresses,
  useMembers,
} from "@signalwire-community/react";
import { useEffect, useState } from "react";
import { time2TimeAgo as toTimeAgo } from "./util";

function DemoSignalWire() {
  const client = useSignalWire({
    token: import.meta.env.VITE_FABRIC_TOKEN,
    host: "puc.signalwire.com",
  });

  const allAddresses = useAddresses(client);
  const rooms = useAddresses(client, { type: "room" });
  const subscribers = useAddresses(client, { type: "subscriber" });

  const [addressToDial, setAddressToDial] = useState(null);
  const [ongoingCall, setOngoingCall] = useState(null);
  const { members, self } = useMembers(ongoingCall);

  const [conversations, setConversations] = useState<any>(null);
  useEffect(() => {
    if (client === null) return;
    (async () => {
      const conv = await client.conversation.getConversations();
      setConversations(conv);
    })();
  }, [client]);

  if (!import.meta.env.VITE_FABRIC_TOKEN) {
    return <div>Token not found</div>;
  }

  const [conversationDetails, setConversationDetails] = useState<any>(null);

  if (client === null) return <div>Loading SignalWire client...</div>;

  return (
    <div>
      <div>
        <h1>Call</h1>
        {addressToDial && (
          <>
            <Call
              client={client}
              address={addressToDial}
              onCallReady={(r) => {
                console.log("Call ready", r);
                setOngoingCall(r);
              }}
            />

            {JSON.stringify(members)}
          </>
        )}
        {!addressToDial && "No ongoing call"}
      </div>

      <div>
        <h3>Rooms</h3>
        {rooms?.data.map((room: any) => (
          <div key={room.id}>
            {room.name}, {room.channels.audio?.split("?")[0]}{" "}
            <button
              onClick={() => {
                setAddressToDial(room);
              }}
            >
              Call
            </button>
          </div>
        ))}

        <h3>Subscribers</h3>
        {subscribers?.data.map((sub: any) => (
          <div key={sub.id}>
            {sub.name}, {sub.channels.audio?.split("?")[0]}{" "}
            <button>Call</button>
          </div>
        ))}

        <h3>Conversations</h3>
        {conversations?.data.map((conv: any) => (
          <div key={conv.id}>
            <b>{conv.name} </b>
            <button
              onClick={async (e) => {
                const convos =
                  await client.conversation.getConversationMessages({
                    addressId: conv.id,
                  });
                console.log(convos);
                //append conversation id (as _cid) to make sure we know where to display this history
                setConversationDetails({ _cid: conv.id, ...convos });
              }}
            >
              See messages
            </button>
            <br />
            was created {toTimeAgo(conv.created_at / 1000)?.toLocaleLowerCase()}
            , <br />
            last message seen at{" "}
            {toTimeAgo(conv.last_message_at / 1000)?.toLocaleLowerCase()}
            {conversationDetails && conversationDetails?._cid === conv.id && (
              <ul>
                {conversationDetails?.data.map((c: any) => (
                  <li key={c.id}>
                    {c.type} {c.subtype} {c.kind} ({toTimeAgo(c.ts)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div>{client && addressToDial !== null && <div></div>}</div>
    </div>
  );
}

export default DemoSignalWire;
