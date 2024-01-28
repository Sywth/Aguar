#!/usr/bin/env node

import inquirer from "inquirer";
import { makeGetRequest } from "./requestWrappers";

enum HttpMethods {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}

const supportedMethods = Object.values(HttpMethods);

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
    choices: supportedMethods,
  });
  return answer.method;
};

const cleanInput = (input: string) => input.trim().toLowerCase();
const parseArguments = (args: string[]) => {
  args = args.map(cleanInput);
  const method = args[0];
  const uri = args[1];
  const flags = args.slice(2, undefined);
  return { method, uri, flags };
};

const main = async () => {
  let args = process.argv.slice(2, undefined);
  let { uri, method, flags } = parseArguments(args);

  while (!uri) {
    uri = await askUri();
  }
  if (!method) {
    method = await askMethod();
  }

  console.log({ uri, method, flags });

  let response: Response | null = null;
  switch (method as HttpMethods) {
    case HttpMethods.get:
      response = await makeGetRequest({ uri });
      break;
    default:
      console.log(
        `Unsupported method : "${method}". Select one from '${supportedMethods.join(
          "' | '"
        )}'`
      );
      break;
  }
  if (response) {
    console.log(response);
  }
};

main();
