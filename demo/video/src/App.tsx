import { Link, Routes, Route, useLocation } from 'react-router-dom';
import DemoConference from './Video/DemoConference';
import DemoVideo from './Video/DemoVideo';

function App() {
  let location = useLocation();
  return (
    <div>
      <h2>Browse Demos</h2>
      <ul>
        {[
          { name: 'Video', url: '/video' },
          { name: 'Video Conference', url: '/videoconference' },
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
        </Routes>
      </ul>
    </div>
  );
}

export default App;
