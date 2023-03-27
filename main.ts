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
				if (
					industryValue
						.toLowerCase()
						.split(" ")
						.filter((word: string) => word !== "and")
						.map((word: string) => word.replaceAll(",", ""))
						.some(
							(r: string) =>
								subsectorValue
									.toLowerCase()
									.split(" ")
									.map((word: string) => word.replaceAll(",", ""))
									.indexOf(r) >= 0
						)
				) {
					XLSX.utils.sheet_add_aoa(industries, [[subsectorId]], {
						origin: `B${industryId}`,
					});

					count++;
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
