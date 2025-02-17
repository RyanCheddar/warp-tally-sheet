/*
 * Version 3.61 made by yippym - 2023-02-57 23:00
 * https://github.com/Yippy/warp-tally-sheet
 */

/**
* Add Formula Character Event Warp History
*/
function addFormulaCharacterEventWarpHistory() {
  addFormulaByWarpHistoryName(WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME);
}
/**
* Add Formula Regular Warp History History
*/
function addFormulaRegularWarpHistory() {
  addFormulaByWarpHistoryName(WARP_TALLY_REGULAR_WARP_SHEET_NAME);
}
/**
* Add Formula Light Cone Event Warp History
*/
function addFormulaLightconeEventWarpHistory() {
  addFormulaByWarpHistoryName(WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME);
}
/**
* Add Formula Beginner Warp History
*/
function addFormulaBeginnerWarpHistory() {
  addFormulaByWarpHistoryName(WARP_TALLY_BEGINNER_WARP_SHEET_NAME);
}

/**
* Add Formula for selected Warp History sheet
*/
function addFormulaWarpHistory() {
  var sheetActive = SpreadsheetApp.getActiveSpreadsheet();
  var warpHistoryName = sheetActive.getSheetName();
  if (WARP_TALLY_NAME_OF_WARP_HISTORY.indexOf(warpHistoryName) != -1) {
    addFormulaByWarpHistoryName(warpHistoryName);
  } else {
    var message = 'Sheet must be called "' + WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME + '" or "' + WARP_TALLY_REGULAR_WARP_SHEET_NAME + '" or "' + WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME + '" or "' + WARP_TALLY_BEGINNER_WARP_SHEET_NAME + '"';
    var title = 'Invalid Sheet Name';
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
  }
}

function addFormulaByWarpHistoryName(name) {
  var sheetSource = getSourceDocument();
  if (sheetSource) {
    // Add Language
    var warpHistorySource;
    var settingsSheet = getSettingsSheet();
    if (settingsSheet) {
      var languageFound = settingsSheet.getRange(2, 2).getValue();
      warpHistorySource = sheetSource.getSheetByName(WARP_TALLY_WARP_HISTORY_SHEET_NAME+"-"+languageFound);
    }
    if (warpHistorySource) {
      // Found language
    } else {
      // Default
      warpHistorySource = sheetSource.getSheetByName(WARP_TALLY_WARP_HISTORY_SHEET_NAME);
    }
    var sheet = findWarpHistoryByName(name,sheetSource);
    sheet.getRange("A1").setFontColor("white").setValue(name);
    var warpHistorySourceNumberOfColumn = warpHistorySource.getLastColumn();
    // Reduce two column due to paste and override
    var warpHistorySourceNumberOfColumnWithFormulas = warpHistorySourceNumberOfColumn - 2;

    var lastRowWithoutTitle = sheet.getMaxRows() - 1;

    var currentOverrideTitleCell = sheet.getRange(1, 2).getValue();
    var sourceOverrideTitleCell = warpHistorySource.getRange(1, 2).getValue();
    if (currentOverrideTitleCell != sourceOverrideTitleCell) {
      // If override column don't exist, populate from source
      var overrideCells = warpHistorySource.getRange(2, 2).getFormula();
      sheet.getRange(2, 2, lastRowWithoutTitle, 1).setValue(overrideCells);
      sheet.getRange(1, 2).setValue(sourceOverrideTitleCell);
      sheet.setColumnWidth(2, warpHistorySource.getColumnWidth(2));
    }
    
    // Get second row formula columns and set current sheet
    var formulaCells = warpHistorySource.getRange(2, 3, 1, warpHistorySourceNumberOfColumnWithFormulas).getFormulas();
    sheet.getRange(2, 3, lastRowWithoutTitle, warpHistorySourceNumberOfColumnWithFormulas).setValue(formulaCells);

    // Get title columns and set current sheet
    var titleCells = warpHistorySource.getRange(1, 3, 1, warpHistorySourceNumberOfColumnWithFormulas).getFormulas();
    sheet.getRange(1, 3, 1, warpHistorySourceNumberOfColumnWithFormulas).setValues(titleCells);

    for (var i = 3; i <= warpHistorySourceNumberOfColumn; i++) {
      // Apply formatting for cells
      var numberFormatCell = warpHistorySource.getRange(2, i).getNumberFormat();
      sheet.getRange(2, i, lastRowWithoutTitle, 1).setNumberFormat(numberFormatCell);
      // Set column width from source
      sheet.setColumnWidth(i, warpHistorySource.getColumnWidth(i));
    }

    // Ensure new row is not the same height as first, if row 2 did not exist
    sheet.autoResizeRows(2, 1);
  } else {
    var message = 'Unable to connect to source';
    var title = 'Error';
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
  }
}

/**
* Check is sheet exist in active spreadsheet, otherwise pull sheet from source
*/
function findWarpHistoryByName(name, sheetSource) {
  var warpHistorySheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (warpHistorySheet == null) {
    if (sheetSource == null) {
      sheetSource = getSourceDocument();
    }
    if (sheetSource) {
      var sheetCopySource = sheetSource.getSheetByName(WARP_TALLY_WARP_HISTORY_SHEET_NAME);
      sheetCopySource.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(name);
      warpHistorySheet = SpreadsheetApp.getActive().getSheetByName(name);
      warpHistorySheet.showSheet();
    }
  }
  return warpHistorySheet;
}

/**
* Add sort for selected Warp History sheet
*/
function sortWarpHistory() {
  var sheetActive = SpreadsheetApp.getActiveSpreadsheet();
  var warpHistoryName = sheetActive.getSheetName();
  if (WARP_TALLY_NAME_OF_WARP_HISTORY.indexOf(warpHistoryName) != -1) {
    sortWarpHistoryByName(warpHistoryName);
  } else {
    var message = 'Sheet must be called "' + WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME + '" or "' + WARP_TALLY_REGULAR_WARP_SHEET_NAME + '" or "' + WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME + '" or "' + WARP_TALLY_BEGINNER_WARP_SHEET_NAME + '"';
    var title = 'Invalid Sheet Name';
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
  }
}

/**
* Sort Character Event Warp History
*/
function sortCharacterEventWarpHistory() {
  sortWarpHistoryByName(WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME);
}

/**
* Sort Regular Warp History
*/
function sortRegularWarpHistory() {
  sortWarpHistoryByName(WARP_TALLY_REGULAR_WARP_SHEET_NAME);
}

/**
* Sort Light Cone Event Warp History
*/
function sortLightconeEventWarpHistory() {
  sortWarpHistoryByName(WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME);
}

/**
* Sort Beginner Warp History
*/
function sortBeginnerWarpHistory() {
  sortWarpHistoryByName(WARP_TALLY_BEGINNER_WARP_SHEET_NAME);
}

function sortWarpHistoryByName(sheetName) {
  var sheet = findWarpHistoryByName(sheetName, null);
  if (sheet) {
    if (sheet.getLastColumn() > 6) {
      var range = sheet.getRange(2, 1, sheet.getMaxRows()-1, sheet.getLastColumn());
      range.sort([{column: 5, ascending: true}, {column: 2, ascending: true}, {column: 7, ascending: true}]);
    } else {
      var message = 'Invalid number of columns to sort, run "Refresh Formula" or "Update Items"';
      var title = 'Error';
      SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
    }
  } else {
    var message = 'Unable to connect to source';
    var title = 'Error';
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
  }
}