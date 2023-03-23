// @deno-types="https://cdn.sheetjs.com/xlsx-0.19.2/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs';

const subsectors = XLSX.readFile('linkedin_subsectors.csv');
const industries = XLSX.readFile('linkedin_industries.csv');