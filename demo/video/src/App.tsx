import { Link, Routes, Route, useLocation } from "react-router-dom";
import DemoConference from "./Video/DemoConference";
import DemoVideo from "./Video/DemoVideo";
import DemoHooks from "./Video/DemoHooks";
import DemoRoomPreview from "./Video/DemoRoomPreview";
import DemoSignalWire from "./SignalWire/DemoSignalWire";

function App() {
  let location = useLocation();
  return (
    <div style={{ maxWidth: 800, minWidth: 400 }}>
      <ul style={{ display: "flex", padding: 5 }}>
        {[
          { name: "Video", url: "/video" },
          { name: "Video Conference", url: "/videoconference" },
          { name: "Room Preview", url: "/roompreview" },
          { name: "Hooks", url: "/hooks" },
          { name: "SignalWire Client", url: "/signalwire" },
        ].map((demo, index) => (
          <li
            key={demo.name}
            style={{
              fontWeight: location.pathname === demo.url ? "bold" : "initial",
              display: "block",
              paddingRight: 30,
            }}
          >
            <Link
              style={{
                textDecoration:
                  location.pathname === demo.url ? "underline" : "none",
              }}
              to={demo.url}
            >
              {demo.name}
            </Link>
          </li>
        ))}
      </ul>

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="video" element={<DemoVideo />} />
        <Route path="videoconference" element={<DemoConference />} />
        <Route path="roompreview" element={<DemoRoomPreview />} />
        <Route path="hooks" element={<DemoHooks />} />
        <Route path="signalwire" element={<DemoSignalWire />} />
      </Routes>
    </div>
  );
}

export default App;
