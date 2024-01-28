# Aguar🔌

A simple cli tool for making requests through npx

- **[GitHub](https://github.com/Sywth/Agua)**
- **[NPM](https://www.npmjs.com/package/aguar)**

## Usage

- Make a http get request

`npx aguar get google.com`

- Or a post

`npx aguar post localhost:3000 --t JSON --b '{ "roomId": 1, "players": ["Ajay","Mao","Xi"] }'`

- Or build a http get request

```
$ npx aguar
$ ? uri : https://stackoverflow.com/questions/244777/can-comments-be-used-in-json
$ ❯ get
  post
  put
  delete
```

### More GET Examples

Query mysterious hidden information 👻

```
$ npx aguar
$ ? uri :  https://en.wikipedia.org/wiki/1989_Tiananmen_Square_protests_and_massacre
$ ? method :  (Use arrow keys)
$ ❯ GET
  POST
  PUT
```

## Full Example

Example of the full console request experience

```
$ npx aguar
$ ? uri :  https://jsonplaceholder.typicode.com/todos/1
$ ? method :  PUT
$ ? Add a payload (body) ? Yes
$ ? Content type :  JSON
$ ? Payload (body) :  { "id": 1, "title": "foo bar biz bax", "body": "this some body text stuff", "userId": 69420 }
********************************************************************************
Requesting ...
Payload =  {
  method: 'PUT',
  uri: 'https://jsonplaceholder.typicode.com/todos/1',
  body: '{ "id": 1, "title": "foo bar biz bax", "body": "this some body text stuff", "userId": 69420 }',
  headers: [ [ 'Content-Type', 'application/json' ] ]
}
********************************************************************************
{
  "id": 1,
  "title": "foo bar biz bax",
  "body": "this some body text stuff",
  "userId": 69420
}
$
```
