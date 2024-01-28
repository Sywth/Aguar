#!/usr/bin/env node

import inquirer from "inquirer";
import {
  httpMethods,
  HttpMethod,
  sendRequest,
  SendRequestProps,
  displayContentType,
  HeadersType,
  ContentType,
  coerceDisplayContentTypeToContentType,
} from "./requestWrappers";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";

const askUri = async () => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "uri",
    message: "uri : ",
  });
  return answer.uri;
};

const askMethod = async () => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "method",
    message: "method : ",
    choices: httpMethods,
  });
  return answer.method;
};

const askShouldSendPayload = async (): Promise<boolean> => {
  const response = await inquirer.prompt({
    type: "confirm",
    name: "shouldSendPayload",
    message: "Add a payload (body) ?",
  });
  return response.shouldSendPayload as boolean;
};

const askContentType = async (): Promise<ContentType> => {
  const response = await inquirer.prompt({
    type: "list",
    name: "contentType",
    message: "Content type : ",
    choices: displayContentType,
  });
  let contentType = coerceDisplayContentTypeToContentType(response.contentType);
  if (contentType === undefined) {
    throw new Error(
      `Unsupported content-type : "${contentType}".` +
        `Select one from '${displayContentType.join("' | '")}'`
    );
  }
  return contentType;
};

const askBody = async (): Promise<string> => {
  const response = await inquirer.prompt({
    type: "input",
    name: "body",
    message: "Payload (body) : ",
  });
  return response.body as string;
};

type AguarProps = {
  method?: HttpMethod;
  uri?: string;
  type?: ContentType;
  body?: string;
};

const parseArguments = (processArgs: string[]): AguarProps => {
  const argv: any = yargs(hideBin(processArgs))
    .usage("Usage: $ npx aguar <httpMethod> <uri> [options]")
    .example(
      "$ npx aguar get http://localhost:3000",
      "Send a GET request to http://localhost:3000"
    )
    .example(
      '$ npx aguar post http://localhost:3000 --t=JSON --b=\'{"firstName": "Bruce", "lastName":"Lee"}\'',
      "Send a POST request to http://localhost:3000 with a JSON body"
    )
    .option("type", {
      alias: "t",
      describe: "Specify the content type of the request payload",
      coerce: (value) => value.toLowerCase(),
      choices: displayContentType.map((contentType) =>
        contentType.toLowerCase()
      ),
    })
    .option("body", {
      alias: "b",
      describe: "Specify the payload of the request",
    })
    .epilog("Made by @Sywth").argv;

  const _method = argv._[0].toUpperCase();
  const _uri = argv._[1];
  const _type = argv["type"];
  const _body = argv["body"];

  const type = _type ? coerceDisplayContentTypeToContentType(_type) : undefined;
  const body = _body ? (_body as string) : undefined;
  const method = validateHttpMethodType(_method) ? _method : undefined;
  const uri = _uri ? fixUri(_uri) : undefined;

  return { method, uri, type, body };
};

const validateHttpMethodType = (method: unknown): method is HttpMethod => {
  return typeof method === "string" && httpMethods.includes(method as any);
};

const fixUri = (uri: string) => {
  if (!uri.startsWith("http")) {
    return `http://${uri}`;
  }
  return uri;
};

const buildRequest = async ({
  method,
  uri,
  type,
  body,
}: AguarProps): Promise<SendRequestProps> => {
  while (!uri) {
    uri = await askUri();
  }
  uri = fixUri(uri);
  if (!method) {
    method = await askMethod();
  }
  if (!validateHttpMethodType(method)) {
    throw new Error(
      `Unsupported method : "${method}".` +
        `Select one from '${httpMethods.join("' | '")}'`
    );
  }

  if (type === undefined && body === undefined) {
    const shouldSendPayload = await askShouldSendPayload();
    if (!shouldSendPayload) {
      return { method, uri };
    }
    type = await askContentType();
    body = await askBody();
  }
  if (type === undefined && body !== undefined) {
    type = await askContentType();
  }
  if (type !== undefined && body === undefined) {
    body = await askBody();
  }

  const headers: HeadersType = [["Content-Type", type as string]];

  return {
    method,
    uri,
    body,
    headers,
  };
};

const main = async () => {
  // Get CLI arguments
  let { method, uri, type, body } = parseArguments(process.argv);
  // Add missing CLI arguments via inquirer
  let request = await buildRequest({ method, uri, type, body });

  console.log("*".repeat(80));
  console.log("Requesting ...");
  console.log("Payload = ", request);
  console.log("*".repeat(80));

  const response = await sendRequest(request);

  if (response) {
    console.log(await response.text());
  }
};

main();
