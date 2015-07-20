# done-worker-autorender

[![npm version](https://badge.fury.io/js/done-worker-autorender.svg)](http://badge.fury.io/js/done-worker-autorender)

A plugin for DoneJS that renders your page in a Web Worker. Works the same as [done-autorender](https://github.com/donejs/autorender).

## Install

```
npm install done-worker-autorender --save
```

## Usage

In your `package.json`:

```json
{
  "name": "my-app",
  ...
  "system": {
    "main": "index.stache!done-worker-autorender"
  }
}
```

## License

MIT
