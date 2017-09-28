const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const sourceMap = require('source-map');

const app = express();
const queue = [];
const parseSource = /\((.*):(\d+):(\d+)\)/;
const maps = {};

async function parseErrors() {
  while (queue.length > 0) {
    const err = queue.shift();
    const mapUrl = `${err.file}.map`;
    if (!maps[mapUrl]) {
      try {
        const file = await fetch(mapUrl);
        const json = await file.json();
        maps[mapUrl] = new sourceMap.SourceMapConsumer(json);
      } catch (e) {
        console.error(e);
      }
    }

    const originalError = err.err
      .split('\n')
      .map(function(line) {
        const match = parseSource.exec(line);
        return match && match.length >= 3 ? parseError(match) : line;
      })
      .join('\n');
    console.log(originalError);
  }
}

function parseError(match) {
  const map = `${match[1]}.map`;
  const line = parseInt(match[2], 10);
  const column = parseInt(match[3], 10);

  try {
    const source = maps[map].originalPositionFor({
      line: line,
      column: column
    });

    if (!source.line) {
      return match.input;
    }

    return match.input.replace(
      match[0],
      `(${source.source}:${source.line}:${source.column})`
    );
  } catch (e) {
    console.error(e);
    return match.input;
  }
}

function verify(error) {
  return typeof error === 'object' && error.err && error.file;
}

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.post('/', function(req, res) {
  if (verify(req.body)) {
    queue.push(req.body);
  } else {
    console.log('Malformed body:', req.body);
  }
  res.status(200);
  res.end();
});

setInterval(parseErrors, 2000);

app.listen(3000, function() {
  console.log('Server running on localhost:3000');
});
