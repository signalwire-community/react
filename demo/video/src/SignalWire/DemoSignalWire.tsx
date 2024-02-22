import {
  Call,
  useSignalWire,
  useAddresses,
  useMembers,
} from "@signalwire-community/react";
import { useEffect, useState } from "react";
import { addressUrlFromAddress, time2TimeAgo as toTimeAgo } from "./util";
import useFirebase from "./useFirebase";

function DemoSignalWire({
  fabricToken,
  username,
}: {
  fabricToken: string;
  username: string;
}) {
  const token = useFirebase();

  const client = useSignalWire({
    token: fabricToken,
    host: "puc.signalwire.com",
  });

  useEffect(() => {
    if (!client || !token) return;
    // here we can register this thing to the interwebs for messaging gathering
    (async () => {
      console.log("Registering device");
      const registerData = await client.registerDevice({
        deviceToken: token,
        deviceType: "Desktop",
      });
      console.log("Registered device", registerData);
    })();
  }, [client, token]);

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
        <h1>You are {username}</h1>
        <h2>Call</h2>
        {addressToDial && (
          <>
            <Call
              client={client}
              address={addressToDial}
              onCallReady={(r: any) => {
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
            {room.name}, {addressUrlFromAddress(room)}{" "}
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
            {sub.name}, {addressUrlFromAddress(sub)}{" "}
            <button
              onClick={() => {
                setAddressToDial(sub);
              }}
            >
              Call
            </button>
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
