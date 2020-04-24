const fs = require("fs");
const lines = fs.readFileSync('./video_phase.csv').toString().split("\n");

const outArray = ["elementId;phaseId"];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineSplit = line.split(";");
    const phases = lineSplit[0];
    const elementId = lineSplit[1];

    // console.log(phases);
    // console.log(elementId);

    if (phases.includes("1")) {
        outArray.push(`(${elementId}, 1)`);
    }
    if (phases.includes("2")) {
        outArray.push(`(${elementId}, 2)`);
    }
    if (phases.includes("3")) {
        outArray.push(`(${elementId}, 3)`);
    }
    if (phases.includes("4")) {
        outArray.push(`(${elementId}, 4)`);
    }
    if (phases.includes("5")) {
        outArray.push(`(${elementId}, 5)`);
    }
};

const stringToWrite = outArray.join("\n");
fs.writeFileSync('./video_phase.out.csv', stringToWrite);

console.log("Wrote " + outArray.length + " to a file (+1 for header)");