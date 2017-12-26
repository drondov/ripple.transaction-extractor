const codeTypes = [
    'tec',
    'tel',
    'ter',
    'tem',
];

const keys = [];
const values = [];
for (const codeType of codeTypes) {
    const codeTypeKeys = Array.prototype.slice.call(
        $(`#${codeType}-codes + p + table td:first-child`),
        0
    ).map(x => x.innerText);
    
    const codeTypeValues = Array.prototype.slice.call(
        $(`#${codeType}-codes + p + table td:last-child`),
        0
    ).map(x => x.innerText);


    keys.push(...codeTypeKeys);
    values.push(...codeTypeValues);
}

const result = {};
for (let i = 0; i < keys.length; ++i) {
    result[keys[i]] = values[i];
}

console.log(JSON.stringify(result, null, 2));