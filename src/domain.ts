import { APIError, DomainRecordNotFoundError } from "./errors.ts";
/**
 * Represents a domain record.
 */
interface domainRecord {
    id: number;
    type: string;
    name: string;
    data: string;
    priority: number | null;
    port: number | null;
    ttl: number;
    weight: number | null;
    flags: number | null;
    tag: string | null;
}

/**
 * Represents the response for updating a domain record.
 */
interface UpdateRecordResponse {
    domain_record: domainRecord;
}

/**
 * Represents the response for listing domain records.
 */
interface ListRecordsResponse {
    domain_records: domainRecord[];
    links: unknown;
    meta: unknown;
}

/**
 * Fetches data from the specified API endpoint using the provided method and apiKey.
 * Optionally sends data in the request body.
 * @param endpoint The API endpoint to fetch data from.
 * @param method The HTTP method to use for the request.
 * @param apiKey The API key for authorization.
 * @param data Optional data to be sent with the request.
 * @returns A Promise resolving to the fetched data.
 * @throws {APIError} Throws an error if the API request fails.
 */
async function fetchAPI(endpoint: string, method: string, apiKey: string, data?: unknown): Promise<unknown> {
    const url = `https://api.digitalocean.com/v2/${endpoint}`;
    const headers = new Headers({
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    });

    const options: RequestInit = {
        method: method,
        headers: headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (response.ok) {
        return response.json();
    }

    console.log(response);
    throw new APIError("Problem fetching data from API", response.status, response.statusText);
}

/**
 * Lists all domain records for a given domain.
 * @param apiKey The API key for authorization.
 * @param domain The domain to list records for.
 * @returns A Promise resolving to a ListRecordsResponse object.
 */
export async function listRecords(apiKey: string, domain: string): Promise<ListRecordsResponse> {
    return await fetchAPI(`domains/${domain}/records`, "GET", apiKey) as ListRecordsResponse;
}

/**
 * Updates a specific domain record.
 * @param apiKey The API key for authorization.
 * @param domain The domain of the record to be updated.
 * @param recordId The ID of the record to be updated.
 * @param data The new data for the record.
 * @returns A Promise resolving to the updated domain record.
 */
export async function updateRecord(
    apiKey: string,
    domain: string,
    recordId: number,
    data: unknown,
): Promise<domainRecord> {
    const result = await fetchAPI(
        `domains/${domain}/records/${recordId}`,
        "PATCH",
        apiKey,
        data,
    ) as UpdateRecordResponse;
    return result.domain_record;
}

/**
 * Retrieves a specific domain record by subdomain and domain.
 * @param apiKey The API key for authorization.
 * @param subdomain The subdomain of the record to retrieve.
 * @param domain The domain of the record to retrieve.
 * @returns A Promise resolving to the found domain record.
 * @throws {Error} Throws an error if the record is not found.
 */
export async function getRecord(apiKey: string, subdomain: string, domain: string): Promise<domainRecord> {
    const recordsResponse: ListRecordsResponse = await listRecords(apiKey, domain);
    const record = recordsResponse.domain_records.find((r) => r.name === subdomain);
    if (!record) {
        throw new DomainRecordNotFoundError(`Record "${subdomain}" not found in "${domain}"`);
    }
    return record;
}

/**
 * Retrieves a specific domain record by ID.
 * @param apiKey The API key for authorization.
 * @param domain The domain of the record to retrieve.
 * @param recordId The ID of the record to retrieve.
 * @returns A Promise resolving to the found domain record.
 */
export async function getRecordById(apiKey: string, domain: string, recordId: number): Promise<domainRecord> {
    return await fetchAPI(`domains/${domain}/records/${recordId}`, "GET", apiKey) as domainRecord;
}
