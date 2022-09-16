export default function ActiveLight({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        background: active ? "green" : "red",
      }}
    ></div>
  );
}
