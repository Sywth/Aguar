const fixUri = (uri: string) => {
  if (!uri.startsWith("http")) {
    return `http://${uri}`;
  }
  return uri;
};

export type RequestProps = {
  uri: string;
};

export type MakeGetRequestProps = RequestProps & {};
export const makeGetRequest = ({ uri }: MakeGetRequestProps) => {
  uri = fixUri(uri);
  return fetch(uri, {
    method: "GET",
  });
};
