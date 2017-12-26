const fs = require('fs');
const path = require('path');
const jayson = require('jayson/promise');
const config = require('./config');


function getClient() {

    const headers = {};
    if (config.rpc.user) {
        const credentials = new Buffer(`${config.rpc.user}:${config.rpc.password}`).toString('base64');
        headers.Authorization = `Basic ${credentials}`;
    }
    const client = jayson.client.http({
        port: config.rpc.port,
        host: config.rpc.host,
        headers,
    });
    return client;
}
const client = getClient();

async function getAccountTransactions(marker) {
    const response = await client.request('account_tx', [{
        ledger_index_min: config.startBlockIndex,
        ledger_index_max: config.lastBlockIndex,
        limit: config.limit,
        account: config.account,
        marker,
    }]);
    return response;
}

async function main() {
    let currentMarker;
    let i = 0;
    do {
        const response = await getAccountTransactions(currentMarker);
        currentMarker = response.result.marker;
        if (currentMarker) console.log(`Progress ${JSON.stringify(currentMarker)} ...`);
        fs.writeFileSync(path.join(config.dataFolder, `response-${i}.json`), JSON.stringify(response));
        ++i;
    } while (currentMarker)
}

main()
    .then(() => {
        console.log('\033[92mSUCCESS\033[0m');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        console.log('\033[93mFAIL\033[0m');
        process.exit(1);
    });
