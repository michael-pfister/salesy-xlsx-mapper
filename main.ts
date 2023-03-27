// @deno-types="https://cdn.sheetjs.com/xlsx-0.19.2/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs";

const subsectors = XLSX.readFile("linkedin_subsectors.csv").Sheets["Sheet1"];
const industries = XLSX.readFile("linkedin_industries.csv").Sheets["Sheet1"];

let count = 0;

Object.keys(subsectors).map((cell: string) => {
	const { subsectorId, subsectorType, subsectorValue } = {
		subsectorId: Number(cell.slice(1)),
		subsectorType: subsectors[cell].t,
		subsectorValue: subsectors[cell].v,
	};

	if (subsectorType === "s" && subsectorValue) {
		Object.keys(industries).map((cell: string) => {
			const { industryId, industryType, industryValue } = {
				industryId: Number(cell.slice(1)),
				industryType: industries[cell].t,
				industryValue: industries[cell].v,
			};

			if (industryType === "s" && industryValue) {
				const industryValues: string[] = industryValue
					.toLowerCase()
					.split(" ")
					.filter((word: string) => word !== "and")
					.map((word: string) => word.replaceAll(",", ""));

				const subsectorValues: string[] = subsectorValue
					.toLowerCase()
					.split(" ")
					.filter((word: string) => word !== "and")
					.map((word: string) => word.replaceAll(",", ""));

				// prioritize exact match
				if (industryValues.join(' ') === subsectorValues.join(' ')) {
					XLSX.utils.sheet_add_aoa(industries, [[subsectorId]], {
						origin: `B${industryId}`,
					});

					count++;
				} else {
					if (
						industryValues.some((r: string) => subsectorValues.indexOf(r) >= 0)
					) {
						XLSX.utils.sheet_add_aoa(industries, [[subsectorId]], {
							origin: `B${industryId}`,
						});

						count++;
					}
				}
			}
		});
	}
});

console.log(`${count} subsectors added to industries`);

XLSX.writeFile(
	{ Sheets: { Sheet1: industries }, SheetNames: ["Sheet1"] },
	"linkedin_industries_new.xlsx"
);

// summarize this program
/**
 * 1. read subsectors and industries
 * 2. loop through subsectors
 * 3. loop through industries
 * 4. if subsector value is included in industry value, add subsector id to industry
 * 5. write new industries file
 * 6. log number of subsectors added to industries
 * 7. done
 */