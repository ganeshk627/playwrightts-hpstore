import fs from 'fs';

export function readJsonData(filePath: string, row?: number) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const testData = JSON.parse(rawData);
    return testData;
}