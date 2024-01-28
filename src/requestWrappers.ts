export const httpMethods = ["GET", "POST", "PUT"] as const;
export type HttpMethod = (typeof httpMethods)[number];

export const displayContentType = ["JSON", "XML", "Text"] as const;
export type DisplayContentType = (typeof displayContentType)[number];

export const displayContentTypeToContentType = {
  JSON: "application/json",
  XML: "application/xml",
  Text: "text/plain",
} as const;

/**
 * Attempts to coerce a displayContentType to a contentType. If the type is not related to displayContentType, returns undefined.
 */
export const coerceDisplayContentTypeToContentType = (type: string) => {
  // cast each element to lowercase, check if type is in displayContentType
  const i = displayContentType
    .map((contentType) => contentType.toLowerCase())
    .indexOf(type.toLowerCase());
  if (i === -1) {
    return undefined;
  }

  return displayContentTypeToContentType[displayContentType[i]];
};

export const contentTypes = [
  "application/json",
  "application/xml",
  "text/plain",
] as const;
export type ContentType = (typeof contentTypes)[number];

export type HeadersType = [string, string][];
export type SendRequestProps = {
  uri: string;
  method: HttpMethod;
  body?: BodyInit;
  headers?: HeadersType;
};

/**
 * Make requests to a given uri.
 */
export const sendRequest = ({
  uri,
  body,
  headers,
  method,
}: SendRequestProps) => {
  return fetch(uri, {
    method: method,
    body: body,
    headers: headers,
  });
};
