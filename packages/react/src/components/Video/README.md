# VideoConference

This React component lets you join and manage SignalWire Video rooms.

## Example

Example usage:

```jsx
<VideoWeb
  style={{ width: 800, height: 600 }}
  token="<YOUR TOKEN HERE>"
  onRoomUpdate={(roomVars) => {
    setLoading(false);
    setRoomSession((r) => roomVars.roomSession ?? r);
    setRoomVariables((r) => ({ ...r, ...roomVars }));
  }}
/>
<button onClick={e=>roomSession?.leave}>Leave</button>
```

See `demo/videoweb` for a full example.
