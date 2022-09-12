export function LayoutSelector(
  currentLayout: string | undefined,
  layouts: string[],
  setLayout: ({ name }: { name: string }) => void
) {
  return (
    <select
      onChange={(e) => {
        setLayout({ name: e.target.value });
      }}
      value={currentLayout}
    >
      {layouts.map((layout: string) => (
        <option value={layout} key={layout}>
          {layout}
        </option>
      ))}
    </select>
  );
}
