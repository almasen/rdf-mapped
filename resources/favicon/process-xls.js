const spreadSheet = SpreadsheetApp.openById("1zKH_wD99Va0GqTpuUaChEjAaD36LZrnQf3K0E12ooi0");
const sheet = spreadSheet.getSheetByName("a");

const replaceCompetenciesWithIndices = () => {
    const startRow = 4;
    const numRows = 9999;

    const dataRange = sheet.getRange(startRow, 1, numRows, 6);

    const data = dataRange.getValues();

    let latestValue = "";
    let index = 0;

    for (var i = 0; i < data.length; ++i) {
        const row = data[i];
        const capability = row[0];
        const category = row[1];
        const competency = row[2];
        const phases = row[3];
        const course = row[4];
        const video = row[5];

        if (i >= 4134) {
            break;
        }

        if (competency !== latestValue) {

            latestValue = competency;
            ++latestValue;
        }

        sheet.getRange(startRow + i, 3).setValue(index);

        SpreadsheetApp.flush();
    }
}


const fillPhaseRows = () => {
    const startRow = 4;
    const numRows = 9999;

    const dataRange = sheet.getRange(startRow, 1, numRows, 6);

    const data = dataRange.getValues();

    let latestValue = "";

    for (var i = 0; i < data.length; ++i) {
        const row = data[i];
        const capability = row[0];
        const category = row[1];
        const competency = row[2];
        const phases = row[3];
        const course = row[4];
        const video = row[5];

        if (i >= 4134) {
            break;
        }

        if (phases !== "") {

            latestValue = "[";

            if (phases.includes("1")) {
                latestValue = latestValue + "1,";
            }

            if (phases.includes("2")) {
                latestValue = latestValue + "2,";
            }

            if (phases.includes("3")) {
                latestValue = latestValue + "3,";
            }

            if (phases.includes("4")) {
                latestValue = latestValue + "4,";
            }

            if (phases.includes("5")) {
                latestValue = latestValue + "5,";
            }

            latestValue = latestValue.slice(0, -1);

            latestValue = latestValue + "]";
        }

        sheet.getRange(startRow + i, 4).setValue(latestValue);
    }
}

const fillRows = () => {
    const startRow = 4;
    const numRows = 9999;

    const dataRange = sheet.getRange(startRow, 1, numRows, 6);

    const data = dataRange.getValues();

    let latestValue = "";

    for (var i = 0; i < data.length; ++i) {
        const row = data[i];
        const capability = row[0];
        const category = row[1];
        const competency = row[2];
        const phases = row[3];
        const course = row[4];
        const video = row[5];

        if (i >= 4134) {
            break;
        }

        if (course !== "") {

            sheet.getRange(startRow + i, 7).setValue(course.toString().trim());

            //SpreadsheetApp.flush();
        }

        if (video !== "") {

            sheet.getRange(startRow + i, 9).setValue(video.toString().trim());

            //SpreadsheetApp.flush();
        }
    }
}

const extractHyperlinks = () => {

    let latestIdx = 4;

    const res = Sheets.Spreadsheets.get("1zKH_wD99Va0GqTpuUaChEjAaD36LZrnQf3K0E12ooi0", {ranges: "a!F4:F4139", fields: "sheets/data/rowData/values/hyperlink"});
    var sheets = res.sheets;
for (var i = 0; i < sheets.length; i++) {
  var data = sheets[i].data;
  for (var j = 0; j < data.length; j++) {
    var rowData = data[j].rowData;
    for (var k = 0; k < rowData.length; k++) {
      var values = rowData[k].values;
      sheet.getRange(latestIdx, 8).setValue(values);
      ++latestIdx;

      //for (var l = 0; l < values.length; l++) {
        //sheet.getRange(latestIdx, 7).setValue("S");
        //sheet.getRange(latestIdx, 7).setValue(values[l].hyperlink);
      //}
    }
  }
}


}