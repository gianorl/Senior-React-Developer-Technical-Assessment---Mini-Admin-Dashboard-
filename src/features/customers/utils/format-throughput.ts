export function formatThroughput(mbps: number) {
  if (mbps >= 1000) {
    return { value: (mbps / 1000).toFixed(1), unit: "Gbps" };
  }
  return { value: String(mbps), unit: "Mbps" };
}
