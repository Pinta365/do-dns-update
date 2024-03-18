/**
 * Represents the response received from fetching public IP information.
 */
interface IPInfoResponse {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    readme: string;
}

/**
 * Fetches public IP information from an external service. (using ipinfo.io as resolver)
 * @returns A Promise that resolves to an IPInfoResponse object containing public IP and its related information.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getPublicIPInfo(): Promise<IPInfoResponse> {
    const response = await fetch("https://ipinfo.io/json");
    if (!response.ok) {
        throw new Error("Failed to fetch public IP");
    }
    const data: IPInfoResponse = await response.json();
    return data;
}
