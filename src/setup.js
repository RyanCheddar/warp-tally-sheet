/*
 * Version 3.61 made by yippym - 2023-02-57 23:00
 * https://github.com/Yippy/warp-tally-sheet
 */
function onInstall(e) {
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    generateInitialiseToolbar();
  } else {
    onOpen(e);
  }
}

function onOpen(e) {
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    generateInitialiseToolbar();
  } else {
    var settingsSheet = SpreadsheetApp.getActive().getSheetByName(WARP_TALLY_SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      generateInitialiseToolbar();
    } else {
      getDefaultMenu();
    }
    checkLocaleIsSetCorrectly();
  }
}

function generateInitialiseToolbar() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Warp Tally')
  .addItem('Initialise', 'updateItemsList')
  .addToUi();
}

function displayUserPrompt(titlePrompt, messagePrompt, buttonSet) {
  const ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    titlePrompt,
    messagePrompt,
    buttonSet);
  return result;
}

function displayUserAlert(titleAlert, messageAlert, buttonSet) {
  const ui = SpreadsheetApp.getUi();
  var result = ui.alert(
    titleAlert,
    messageAlert,
    buttonSet);
  return result;
}

/* Ensure Sheets is set to the supported locale due to source document formula */
function checkLocaleIsSetCorrectly() {
  var currentLocale = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale();
  if (currentLocale != WARP_TALLY_SHEET_SUPPORTED_LOCALE) {
    SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetLocale(WARP_TALLY_SHEET_SUPPORTED_LOCALE);
    var message = 'To ensure compatibility with formula from source document, your locale "'+currentLocale+'" has been changed to "'+WARP_TALLY_SHEET_SUPPORTED_LOCALE+'"';
    var title = 'Sheets Locale Changed';
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
  }
}

function getDefaultMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Warp Tally')
  .addSeparator()
  .addSubMenu(ui.createMenu('Character Event Warp History')
            .addItem('Sort Range', 'sortCharacterEventWarpHistory')
            .addItem('Refresh Formula', 'addFormulaCharacterEventWarpHistory'))
  .addSubMenu(ui.createMenu('Regular Warp History')
            .addItem('Sort Range', 'sortRegularWarpHistory')
            .addItem('Refresh Formula', 'addFormulaRegularWarpHistory'))
  .addSubMenu(ui.createMenu('Light Cone Event Warp History')
            .addItem('Sort Range', 'sortLightconeEventWarpHistory')
            .addItem('Refresh Formula', 'addFormulaLightconeEventWarpHistory'))
  .addSubMenu(ui.createMenu('Beginner Warp History')
            .addItem('Sort Range', 'sortBeginnerWarpHistory')
            .addItem('Refresh Formula', 'addFormulaBeginnerWarpHistory'))
  .addSeparator()
  .addSubMenu(ui.createMenu('AutoHotkey')
            .addItem('Clear', 'clearAHK')
            .addItem('Convert', 'convertAHK')
            .addItem('Import', 'importAHK')
            .addSeparator()
            .addItem('Generate', 'generateAHK'))
  .addSeparator()
  .addSubMenu(ui.createMenu('HoYoLAB Sync')
            .addItem('Characters', 'importHoYoLabCharactersButtonScript')
            .addItem('Light Cones', 'importHoYoLabLightconesButtonScript')
            .addSeparator()
            .addItem('Tutorial', 'displayHoYoLab'))
  .addSeparator()
  .addSubMenu(ui.createMenu('Data Management')
            .addItem('Import', 'importDataManagement')
            .addSeparator()
            .addItem('Set Schedule', 'setTriggerDataManagement')
            .addItem('Remove All Schedule', 'removeTriggerDataManagement')
            .addSeparator()
            .addItem('Auto Import', 'importFromAPI')
            .addItem('Tutorial', 'displayAutoImport')
            )
  .addSeparator()
  .addItem('Quick Update', 'quickUpdate')
  .addItem('Update Items', 'updateItemsList')
  .addItem('Get Latest README', 'displayReadme')
  .addItem('About', 'displayAbout')
  .addToUi();
}

function getSettingsSheet() {
  var settingsSheet = SpreadsheetApp.getActive().getSheetByName(WARP_TALLY_SETTINGS_SHEET_NAME);
  var sheetSource;
  if (!settingsSheet) {
    sheetSource = getSourceDocument();
    var sheetSettingSource = sheetSource.getSheetByName(WARP_TALLY_SETTINGS_SHEET_NAME);
    if (sheetSettingSource) {
      settingsSheet = sheetSettingSource.copyTo(SpreadsheetApp.getActiveSpreadsheet());
      settingsSheet.setName(WARP_TALLY_SETTINGS_SHEET_NAME);
      getDefaultMenu();
    }
  } else {
    settingsSheet.getRange("H1").setValue(WARP_TALLY_SHEET_SCRIPT_VERSION);
  }
  var dashboardSheet = SpreadsheetApp.getActive().getSheetByName(WARP_TALLY_DASHBOARD_SHEET_NAME);
  if (!dashboardSheet) {
    if (!sheetSource) {
      sheetSource = getSourceDocument();
    }
    var sheetDashboardSource = sheetSource.getSheetByName(WARP_TALLY_DASHBOARD_SHEET_NAME);
    if (sheetDashboardSource) {
      dashboardSheet = sheetDashboardSource.copyTo(SpreadsheetApp.getActiveSpreadsheet());
      dashboardSheet.setName(WARP_TALLY_DASHBOARD_SHEET_NAME);
    }
  } else {
    if (WARP_TALLY_SHEET_SCRIPT_IS_ADD_ON) {
      dashboardSheet.getRange(dashboardEditRange[8]).setFontColor("green").setFontWeight("bold").setHorizontalAlignment("left").setValue("Add-On Enabled");
    } else {
      dashboardSheet.getRange(dashboardEditRange[8]).setFontColor("white").setFontWeight("bold").setHorizontalAlignment("left").setValue("Embedded Script");
    }
  }
  return settingsSheet;
}