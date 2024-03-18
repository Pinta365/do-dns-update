import { getRecord, updateRecord } from "./lib/domain.ts";
import { getPublicIPInfo } from "./lib/network.ts";

/**
 * Represents the response from setting an IP address for a subdomain.
 */
interface IPSetResponse {
    /** Indicates if the operation was successful. */
    success: boolean;
    /** The full subdomain affected by the operation. */
    subdomain: string;
    /** The IP address set for the subdomain, null if not applicable. */
    ip: string | null;
    /** Message detailing the outcome of the operation. */
    message: string;
}

/**
 * Manages DNS records by interfacing with the Digital Ocean API
 */
class RecordManager {
    /** The API key used for authentication with the API. */
    private apiKey: string;

    /**
     * Initializes a new instance of the RecordManager class.
     * @param apiKey The API key for accessing the Digital Ocean API.
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Sets the IP address for a given subdomain, optionally overriding the current IP.
     * If no IP override is provided, the current public IP is used. (using ipinfo.io as resolver).
     * @param subdomain The subdomain to update.
     * @param domain The domain within which the subdomain resides.
     * @param ipOverride Optional. An IP address to set for the subdomain, bypassing auto-detection.
     * @returns A Promise resolving to an object detailing the outcome of the operation.
     */
    async setIP(
        subdomain: string,
        domain: string,
        ipOverride: string | null = null,
    ): Promise<IPSetResponse> {
        const returnObject: IPSetResponse = {
            success: true,
            subdomain: `${subdomain}.${domain}`,
            ip: null,
            message: "",
        };

        let ip = ipOverride || "";

        try {
            if (!ipOverride) {
                ip = (await getPublicIPInfo()).ip;
            }

            const record = await getRecord(this.apiKey, subdomain, domain);

            if (record.data === ip) {
                returnObject.message = "No update needed";
                returnObject.ip = record.data;
            } else {
                const updateResult = await updateRecord(this.apiKey, domain, record.id, { data: ip });

                returnObject.message = "Update successful";
                returnObject.ip = updateResult.data;
            }
        } catch (error) {
            throw new Error(error.message);
        }

        return returnObject;
    }
}

export { RecordManager };
