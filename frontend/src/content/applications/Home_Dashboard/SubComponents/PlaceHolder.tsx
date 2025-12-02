export function PlaceHolder({ height }: { height: number }) {
  return (
    <div style={{ height: `${height}px`, backgroundColor: "#f0f0f0" }}>
      <p
        style={{
          textAlign: "center",
          lineHeight: `${height}px`,
          color: "#999",
        }}
      >
        Placeholder ({height}px)
      </p>
    </div>
  );
  // ... contenu du composant
}
