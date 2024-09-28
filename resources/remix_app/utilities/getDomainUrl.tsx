export const getDomainUrl = (request: any): string => {
  const host =
    request.headers().host;

  if (!host) {
    throw new Error("Could not determine domain URL.");
  }

  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1")
      ? "http"
      : "https";
  return `${protocol}://${host}`;};
