# rss-feed

An intelligent feed reader

## Build Setup

``` bash
# client
cd ./client; npm install; npm run dev;

# server
cd ./server; npm install; npm run nodemon;
```

# Add a config file in the server folder

``` json
{
  "configFile":           "./data/config.json",
  "boardsFile":           "./data/boards.json",
  "isFakeData":           true,
  "consumer_key":         "...",
  "consumer_secret":      "...",
  "access_token":         "...",
  "access_token_secret":  "...",
}


```
