export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <span className="text-2xl font-bold text-white">BP</span>
        </div>
        <h1 style={{ color: "var(--color-primary)" }}>BuyerPocket</h1>
        <p className="text-body text-center max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          Your smart home buying companion. Foundation setup complete.
        </p>
      </div>

      {/* Design token showcase */}
      <div
        className="rounded-lg p-6 w-full max-w-lg flex flex-col gap-4"
        style={{
          backgroundColor: "var(--color-surface)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3>Design Tokens Active</h3>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "primary", bg: "var(--color-primary)", light: true },
            { label: "secondary", bg: "var(--color-secondary)", light: true },
            { label: "accent", bg: "var(--color-accent)", light: true },
            { label: "error", bg: "var(--color-error)", light: true },
            { label: "surface-container", bg: "var(--color-surface-container)", light: false },
            { label: "border", bg: "var(--color-border)", light: false },
          ].map(({ label, bg, light }) => (
            <div
              key={label}
              className="px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: bg,
                color: light ? "#fff" : "var(--color-text-primary)",
                borderRadius: "var(--radius-full)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap items-baseline">
          <span className="text-label" style={{ color: "var(--color-text-secondary)" }}>LABEL STYLE</span>
          <span className="text-caption" style={{ color: "var(--color-text-secondary)" }}>Caption 12px</span>
          <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>Body SM 14px</span>
          <span className="text-body" style={{ color: "var(--color-text-secondary)" }}>Body 16px</span>
          <span className="text-body-lg" style={{ color: "var(--color-text-secondary)" }}>Body LG 18px</span>
        </div>

        <div
          className="px-3 py-2 text-body-sm"
          style={{
            backgroundColor: "var(--color-surface-container)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          <span className="text-label">Status: </span>Foundation ready — awaiting features
        </div>
      </div>

      {/* Route groups indicator */}
      <p className="text-caption" style={{ color: "var(--color-text-secondary)" }}>
        Route groups:{" "}
        <code className="font-mono" style={{ color: "var(--color-accent)" }}>(marketing)</code>
        {" · "}
        <code className="font-mono" style={{ color: "var(--color-accent)" }}>(app)</code>
      </p>
    </main>
  );
}
