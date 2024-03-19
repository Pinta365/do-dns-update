/**
 * Custom error class representing an API error.
 * @class
 * @extends {Error}
 */
export class APIError extends Error {
    statusCode: number;
    responseBody: string;

    constructor(message: string, statusCode: number, responseBody: string) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

/**
 * Custom error class representing a missing domain record.
 * @class
 * @extends {Error}
 */
export class DomainRecordNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DomainRecordNotFoundError";
    }
}

/**
 * Custom error class representing a general RecordManager Error.
 * @class
 * @extends {Error}
 */
export class RecordManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RecordManagerError";
    }
}
