### Ripple transaction extractor script

#### Config example
```
{
    "rpc": {
        "host": "localhost",
        "port": "6005"
    },
    "limit": 1000,
    "startBlockIndex": -1,
    "lastBlockIndex": -1,
    "account": "r4mHqCpun2dVCBSSUebiqjVNoB2sujbCT3",
    "dataFolder": "./data"
}
```

#### Getting started

##### Download all transactions
```
npm install
# For data saving from daemon
# create config.json
node extract
```
