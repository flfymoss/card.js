# Card.js
### Make a card from your emotion. （エモいカードを作ろう）

---

## Preparation
- Please build JS-Interpreter before make a card : `npm run prepare`

## Make a card

```sh
node ./make.js [PNG file path for card graphic. Must be square size] [JS file path for embedding] [PNG file path for output]
```

For example: 

```sh
node ./make.js assets/flower_320x320.png assets/my_soul.js ./output/my_card.png
```

## Load a card on Node.js

```sh
node ./examples/node/load.js [PNG card file path]
```

For example:

```sh
node ./examples/node/load.js ./output/my_card.png
```

## Load a card on Browser
- See `examples/browser`.
- Example page could launch with `npm run browser`.

---

## License
Apache License 2.0
