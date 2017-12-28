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

async function main() {
    let i = 0;
    const txIds = JSON.parse(fs.readFileSync(process.argv[2]).toString());
    const result = [];
    for (const txId of txIds) {
        const response = await client.request('tx', [{
            transaction: txId,
        }]);
        result.push(response);
        console.log(`Request ${i} ...`);
        i++;
    }
    fs.writeFileSync(path.join(config.dataFolder, `response.json`), JSON.stringify(result, null, 2));
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
