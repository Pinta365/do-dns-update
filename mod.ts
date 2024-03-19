import { getRecord, updateRecord } from "./src/domain.ts";
import { getPublicIPInfo } from "./src/network.ts";
import { RecordManagerError } from "./src/errors.ts";

/**
 * Represents the response from setting an IP address for a subdomain.
 */
interface IPSetResponse {
    /** Indicates if the operation was successful. */
    success: boolean;
    /** The record (subdomain+domain) affected by the operation. */
    record: string;
    /** The IP address set for the subdomain */
    ip: string | null;
    /** Message detailing the outcome of the operation. */
    message: string;
}

/**
 * Represents the response from setting an IP address for a subdomain.
 */
interface TTLSetResponse {
    /** Indicates if the operation was successful. */
    success: boolean;
    /** The record (subdomain+domain) affected by the operation. */
    record: string;
    /** The time to live for the record, in seconds. */
    ttl: number;
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
     * Sets the IP address for a given subdomain record, optionally overriding the current IP.
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
            record: `${subdomain}.${domain}`,
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
            throw new RecordManagerError(error.message);
        }

        return returnObject;
    }

    /**
     * Sets the Time To Live for for a given subdomain record.
     * @param subdomain The subdomain to update.
     * @param domain The domain within which the subdomain resides.
     * @param ttl The time to live for the record, in seconds.
     * @returns A Promise resolving to an object detailing the outcome of the operation.
     */
    async setTTL(
        subdomain: string,
        domain: string,
        ttl: number,
    ): Promise<TTLSetResponse> {
        const returnObject: TTLSetResponse = {
            success: true,
            record: `${subdomain}.${domain}`,
            ttl: 1800,
            message: "",
        };

        try {
            const record = await getRecord(this.apiKey, subdomain, domain);

            if (record.ttl === ttl) {
                returnObject.message = "No update needed";
                returnObject.ttl = record.ttl;
            } else {
                const updateResult = await updateRecord(this.apiKey, domain, record.id, { ttl: ttl });
                console.log("updateResult", updateResult);
                returnObject.message = "Update successful";
                returnObject.ttl = updateResult.ttl;
            }
        } catch (error) {
            throw new RecordManagerError(error.message);
        }

        return returnObject;
    }
}

export { RecordManager };
