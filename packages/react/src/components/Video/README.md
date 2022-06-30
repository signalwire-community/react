# VideoConference

This React component lets you join and manage SignalWire Video rooms.

## Example

Example usage:

```jsx
<Video
  token={import.meta.env.VITE_ROOM_TOKEN}
  onRoomReady={(roomSession) => {
    setRoomSession(roomSession);
  }}          
/>
```

See `demo/videoweb` for a full example.
