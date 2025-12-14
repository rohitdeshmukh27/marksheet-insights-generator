import fs from 'fs';
import csv from 'csv-parser';


export function parseCSV(filepath) {
return new Promise((resolve, reject) => {
const results = [];
fs.createReadStream(filepath)
.pipe(csv())
.on('data', (data) => {
// Normalize: ensure numeric fields are numbers
const normalized = Object.fromEntries(
Object.entries(data).map(([k, v]) => [k.trim(), v.trim()])
);
results.push(normalized);
})
.on('end', () => resolve(results))
.on('error', (err) => reject(err));
});
}