import { Link, Routes, Route, useLocation } from 'react-router-dom';
import DemoConference from './Video/DemoConference';
import DemoVideo from './Video/DemoVideo';
import DemoRoomPreview from './Video/DemoRoomPreview';

function App() {
  let location = useLocation();
  return (
    <div>
      <h2>Browse Demos</h2>
      <ul>
        {[
          { name: 'Video', url: '/video' },
          { name: 'Video Conference', url: '/videoconference' },
          { name: 'Room Preview', url: '/roompreview' },
        ].map((demo, index) => (
          <li
            key={demo.name}
            style={{
              fontWeight: location.pathname === demo.url ? 'bold' : 'initial',
            }}
          >
            <Link to={demo.url}>{demo.name}</Link>
          </li>
        ))}

        <Routes>
          <Route path="/" element={<></>} />
          <Route path="video" element={<DemoVideo />} />
          <Route path="videoconference" element={<DemoConference />} />
          <Route path="roompreview" element={<DemoRoomPreview />} />
        </Routes>
      </ul>
    </div>
  );
}

export default App;
