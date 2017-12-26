const path = require('path');
const fs = require('fs');
const json2csv = require('json2csv');
const _ = require('lodash');
const glob = require('glob');
const config = require('./config');
const transactionResultDescriptions = require('./transactionResultDescriptions');

const TX_STATUS_SUCCESS = 'tesSUCCESS';

function getAllTransactions() {
    const files = glob.sync(path.resolve(path.join(config.dataFolder, '/response-*.json')));
    files.sort((a, b) => {
        const aNumber = a.match(/\/response-([0-9]+).json$/)[1];
        const bNumber = b.match(/\/response-([0-9]+).json$/)[1];
        return aNumber - bNumber;
    });
    const responses = files.map(file => {
        return JSON.parse(fs.readFileSync(file).toString());
    });
    return _(responses)
        .map('result.transactions')
        .flatten()
        .value();
}

function hasProblem(transaction) {
    if (transaction.meta.TransactionResult !== TX_STATUS_SUCCESS) return true;
    if (transaction.meta.delivered_amount !== transaction.tx.Amount) return true;
    return false;
}

function formatTransaction(transaction) {
    return {
        transactionResult: transaction.meta.TransactionResult,
        deliveredAmount: transaction.meta.delivered_amount,
        amount: transaction.tx.Amount,
        from: transaction.tx.Account,
        to: transaction.tx.Destination,
        hash: transaction.tx.hash,
        destinationTag: transaction.tx.DestinationTag,
    };
}

function addProblemDescription(transaction) {
    if (transaction.amount !== transaction.deliveredAmount) {
        transaction.description = 'Delivered Amount not equal to Amount';
    }
    if (transaction.transactionResult !== TX_STATUS_SUCCESS) {
        transaction.description = transactionResultDescriptions[transaction.transactionResult];
    }
    return transaction;
}

function generateCSV(transactions) {
    const fields = ['hash', 'from', 'destinationTag', 'amount', 'transactionResult', 'description'];
    const csv = json2csv({ data: transactions, fields: fields });
     
    fs.writeFileSync(path.join(config.dataFolder, 'report.csv'), csv);
}

function main() {
    const transactions = getAllTransactions()
        .filter(hasProblem)
        .map(formatTransaction)
        .map(addProblemDescription);

    generateCSV(transactions);
}

main();