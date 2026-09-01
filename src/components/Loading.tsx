interface LoadingProps {
  label?: string;
}

export function Loading({ label = "Loading" }: LoadingProps) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-dot" />
      <span className="mono">{label}</span>
    </div>
  );
}

export function PageLoading() {
  return (
    <main style={{ minHeight: "78vh", display: "grid", placeItems: "center" }}>
      <Loading />
    </main>
  );
}
