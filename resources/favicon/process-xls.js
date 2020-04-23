const spreadSheet = SpreadsheetApp.openById("1366wGzD-r1OHfIgonw957oiMugzyihBpZKa7QHrUkW4");
const sheet = spreadSheet.getSheetByName("Copy of Copy of Sheet1");

const fillRows = () => {
    const startRow = 4;
    const numRows = 9999;

    const dataRange = sheet.getRange(startRow, 1, numRows, 4);

    const data = dataRange.getValues();

    let latestValue = "";

    for (var i = 0; i < data.length; ++i) {
        const row = data[i];
        const capability = row[0];
        const category = row[1];
        const competency = row[2];
        const phases = row[3];

        if (i >= 4130) {
            break;
        }

        if (capability === "") { // Prevents sending

            // const prevRow = data[i-1];
            // const prevCapability = prevRow[0];

            sheet.getRange(startRow + i, 1).setValue(latestValue);

            // Make sure the cell is updated right away in case the script is interrupted
            SpreadsheetApp.flush();
        } else {
            latestValue = capability;
        }
    }
}