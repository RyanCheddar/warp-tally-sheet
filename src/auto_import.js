/*
 * Version 3.61 made by yippym - 2023-02-57 23:00
 * https://github.com/Yippy/warp-tally-sheet
 */
function extractAuthKeyFromInput(userInput) {
  urlForAPI = userInput.toString().split("&");
  var foundAuth = "";
  for (var i = 0; i < urlForAPI.length; i++) {
    var queryString = urlForAPI[i].toString().split("=");
    if (queryString.length == 2) {
      if (queryString[0] == "authkey") {
        foundAuth = queryString[1];
        break;
      }
    }
  }
  return foundAuth;
}

function testAuthKeyInputValidity(userInput) {
  var authKey = extractAuthKeyFromInput(userInput);
  if (authKey == "") {
    return false;
  }

  const USING_BANNER = "Regular Warp History";

  var settingsSheet = getSettingsSheet();
  var queryBannerCode = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[USING_BANNER]["gacha_type"];
  var selectedServer = settingsSheet.getRange("B3").getValue();
  var languageSettings = AUTO_IMPORT_LANGUAGE_SETTINGS_FOR_IMPORT[settingsSheet.getRange("B2").getValue()];
  if (languageSettings == null) {
    // Get default language
    languageSettings = AUTO_IMPORT_LANGUAGE_SETTINGS_FOR_IMPORT["English"];
  }
  var urlForWarpHistory = selectedServer == "China" ? AUTO_IMPORT_URL_CHINA : AUTO_IMPORT_URL;
  urlForWarpHistory += "?" + AUTO_IMPORT_ADDITIONAL_QUERY.join("&") + "&authkey=" + authKey + "&lang=" + languageSettings['code'] + "&gacha_type=" + queryBannerCode;

  responseJson = JSON.parse(UrlFetchApp.fetch(urlForWarpHistory).getContentText());
  if (responseJson.retcode === 0) {
    return true;
  }
  return false;
}


const CACHED_AUTHKEY_PROPERTY = "cachedAuthKey_" + SpreadsheetApp.getActiveSpreadsheet().getId();
// shape: {userInput: string, timeOfInput: Date}

function invalidateCachedAuthKey() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty(CACHED_AUTHKEY_PROPERTY);
}

function setCachedAuthKeyInput(userInput) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(CACHED_AUTHKEY_PROPERTY, JSON.stringify({ userInput, timeOfInput: new Date() }));
}

function getCachedAuthKeyInput() {
  const userProperties = PropertiesService.getUserProperties();
  const cachedAuthKey = JSON.parse(userProperties.getProperty(CACHED_AUTHKEY_PROPERTY));

  if (cachedAuthKey == null) {
    return null;
  }

  const timeOfInput = new Date(cachedAuthKey.timeOfInput);
  const timeDiff = new Date().getTime() - timeOfInput.getTime();
  if (timeDiff > CACHED_AUTHKEY_TIMEOUT) {
    invalidateCachedAuthKey();
    return null;
  }

  if (!testAuthKeyInputValidity(cachedAuthKey.userInput)) {
    invalidateCachedAuthKey();
    return null;
  }

  return cachedAuthKey.userInput;
}


var errorCodeNotEncountered = true;

function importFromAPI(urlForAPI) {
  errorCodeNotEncountered = true;
  var settingsSheet = getSettingsSheet();
  settingsSheet.getRange("E42").setValue(new Date());
  settingsSheet.getRange("E43").setValue("");

  if (AUTO_IMPORT_URL_FOR_API_BYPASS != "") {
    urlForAPI = AUTO_IMPORT_URL_FOR_API_BYPASS;
  }
  var foundAuth = extractAuthKeyFromInput(urlForAPI);
  var bannerName;
  var bannerSheet;
  var bannerSettings;
  if (foundAuth == "") {
    // Display auth key not available
    for (var i = 0; i < WARP_TALLY_NAME_OF_WARP_HISTORY.length; i++) {
      bannerName = WARP_TALLY_NAME_OF_WARP_HISTORY[i];
      bannerSettings = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[bannerName];
      settingsSheet.getRange(bannerSettings['range_status']).setValue("No auth key");
    }
  } else {
    var selectedLanguageCode = settingsSheet.getRange("B2").getValue();
    var selectedServer = settingsSheet.getRange("B3").getValue();
    var languageSettings = AUTO_IMPORT_LANGUAGE_SETTINGS_FOR_IMPORT[selectedLanguageCode];
    if (languageSettings == null) {
      // Get default language
      languageSettings = AUTO_IMPORT_LANGUAGE_SETTINGS_FOR_IMPORT["English"];
    }
    var urlForWarpHistory;
    if (selectedServer == "China") {
      urlForWarpHistory = AUTO_IMPORT_URL_CHINA;
    } else {
      urlForWarpHistory = AUTO_IMPORT_URL;
    }
    urlForWarpHistory += "?"+AUTO_IMPORT_ADDITIONAL_QUERY.join("&")+"&authkey="+foundAuth+"&lang="+languageSettings['code'];
    errorCodeNotEncountered = true;
    // Clear status
    for (var i = 0; i < WARP_TALLY_NAME_OF_WARP_HISTORY.length; i++) {
      bannerName = WARP_TALLY_NAME_OF_WARP_HISTORY[i];
      bannerSettings = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[bannerName];
      settingsSheet.getRange(bannerSettings['range_status']).setValue("");
    }
    for (var i = 0; i < WARP_TALLY_NAME_OF_WARP_HISTORY.length; i++) {
      if (errorCodeNotEncountered) {
        bannerName = WARP_TALLY_NAME_OF_WARP_HISTORY[i];
        bannerSettings = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[bannerName];
        var isToggled = settingsSheet.getRange(bannerSettings['range_toggle']).getValue();
        if (isToggled == true) {
          bannerSheet = SpreadsheetApp.getActive().getSheetByName(bannerName);
          if (bannerSheet) {
            checkPages(urlForWarpHistory, bannerSheet, bannerName, bannerSettings, languageSettings, settingsSheet);
          } else {
            settingsSheet.getRange(bannerSettings['range_status']).setValue("Missing sheet");
          }
        } else {
          settingsSheet.getRange(bannerSettings['range_status']).setValue("Skipped");
        }
      } else {
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Stopped Due to Error:\n"+settingsSheet.getRange(bannerSettings['range_status']).getValue());
        break;
      }
    }
  }
  settingsSheet.getRange("E43").setValue(new Date());
}

function checkPages(urlForWarpHistory, bannerSheet, bannerName, bannerSettings, languageSettings, settingsSheet) {
  settingsSheet.getRange(bannerSettings['range_status']).setValue("Starting");
  /* Get latest warp from banner */
  var iLastRow = bannerSheet.getRange(2, 5, bannerSheet.getLastRow(), 1).getValues().filter(String).length;
  var warpTextString;
  var lastWarpDateAndTimeString;
  var lastWarpDateAndTime;
  if (iLastRow && iLastRow != 0 ) {
    iLastRow++;
    lastWarpDateAndTimeString = bannerSheet.getRange("E" + iLastRow).getValue();
    warpTextString = bannerSheet.getRange("A" + iLastRow).getValue();
    if (lastWarpDateAndTimeString) {
      settingsSheet.getRange(bannerSettings['range_status']).setValue("Last warp: "+lastWarpDateAndTimeString);
      lastWarpDateAndTimeString = lastWarpDateAndTimeString.split(" ").join("T");
      lastWarpDateAndTime = new Date(lastWarpDateAndTimeString+".000Z");
    } else {
      iLastRow = 1;
      settingsSheet.getRange(bannerSettings['range_status']).setValue("No previous warpes");
    }
    iLastRow++; // Move last row to new row
  } else {
    iLastRow = 2; // Move last row to new row
    settingsSheet.getRange(bannerSettings['range_status']).setValue("");
  }
  
  var extractWarpes = [];
  var page = 1;
  var queryBannerCode = bannerSettings["gacha_type"];
  var numberOfWarpPerPage = 6;
  var urlForBanner = urlForWarpHistory+"&game_biz=hkrpg_global"+"&gacha_type="+queryBannerCode+"&size="+numberOfWarpPerPage;
  var failed = 0;
  var is_done = false;
  var end_id = 0;
  
  var checkPreviousDateAndTimeString = "";
  var checkPreviousDateAndTime;
  var checkOneSecondOffDateAndTime;
  var overrideIndex = 0;
  var textWarp;
  var oldTextWarp;
  while (!is_done) {
    settingsSheet.getRange(bannerSettings['range_status']).setValue("Loading page: "+page);
    var response = UrlFetchApp.fetch(urlForBanner+"&page="+page+"&end_id="+end_id);
    var jsonResponse = response.getContentText();
    var jsonDict = JSON.parse(jsonResponse);
    var jsonDictData = jsonDict["data"];
    if (jsonDictData) {
      var listOfWarpes = jsonDictData["list"];
      var listOfWarpesLength = listOfWarpes.length;
      var warp;
      if (listOfWarpesLength > 0) {
        for (var i = 0; i < listOfWarpesLength; i++) {
          warp = listOfWarpes[i];
          var dateAndTimeString = warp['time'];
          textWarp = warp['item_type']+warp['name'];
          /* Mimic the website in showing specific language wording */
          if (warp['rank_type'] == 4) {
            textWarp += languageSettings["4_star"];
          } else if (warp['rank_type'] == 5) {
            textWarp += languageSettings["5_star"];
          }
          oldTextWarp = textWarp+dateAndTimeString;
          var gachaString = "gacha_type_"+warp['gacha_type'];
          var bannerName = "Error New Banner";
          if (gachaString in languageSettings) {
            bannerName = languageSettings[gachaString];
          }
          textWarp += bannerName+dateAndTimeString;

          var dateAndTimeStringModified = dateAndTimeString.split(" ").join("T");
          var warpDateAndTime = new Date(dateAndTimeStringModified+".000Z");

          if (overrideIndex == 0 && checkPreviousDateAndTime) {
            /* Check one second difference from previous single warp */
            checkOneSecondOffDateAndTime = new Date(checkPreviousDateAndTime.valueOf());
            checkOneSecondOffDateAndTime.setSeconds(checkOneSecondOffDateAndTime.getSeconds()-1);
            if (checkOneSecondOffDateAndTime.valueOf() == warpDateAndTime.valueOf()) {
              var nextWarpIndex = i+1;
              if (nextWarpIndex < listOfWarpesLength) {
                var nextWarp = listOfWarpes[nextWarpIndex];
                var nextDateAndTimeString = nextWarp['time'];
                var nextDateAndTimeStringModified = nextDateAndTimeString.split(" ").join("T");
                var nextWarpDateAndTime = new Date(nextDateAndTimeStringModified+".000Z");
                if (checkOneSecondOffDateAndTime.valueOf() == nextWarpDateAndTime.valueOf()) {
                  // Due to warp date and time is only second difference, it's therefore a multi. Override previous warp to match.
                  checkPreviousDateAndTimeString = dateAndTimeString;
                  checkPreviousDateAndTime = new Date(warpDateAndTime.valueOf());
                }
              }
            }
          }
          if (checkPreviousDateAndTimeString === dateAndTimeString) {
            // Found matching date and time to previous warp
            if (overrideIndex == 0) {
              // Start multi 10 index
              var previousWarpIndex = extractWarpes.length - 1;
              var previousWarp = extractWarpes[previousWarpIndex];
              overrideIndex = 10;
              previousWarp[1] = overrideIndex;
              extractWarpes[previousWarpIndex] = previousWarp;
            }
            if (overrideIndex == 1) {
              errorCodeNotEncountered = false;
              is_done = true;
              settingsSheet.getRange(bannerSettings['range_status']).setValue("Error: Multi warp contains 11 within same date and time:"+dateAndTimeString+", found so far: "+extractWarpes.length);
              break;
            } else {
              overrideIndex--;
            }
          } else {
            if (overrideIndex > 1) {
              // Resume counting down when override is set more than 1, add a second to checkPreviousDateAndTime
              checkPreviousDateAndTime.setSeconds(checkPreviousDateAndTime.getSeconds()-1);
              if (checkPreviousDateAndTime.valueOf() == warpDateAndTime.valueOf()) {
                // Within 1 second range resuming multi count
                overrideIndex--;
              } else {
                errorCodeNotEncountered = false;
                is_done = true;
                settingsSheet.getRange(bannerSettings['range_status']).setValue("Error: Multi warp is incomplete with override "+overrideIndex+"@"+dateAndTimeString+", found so far: "+extractWarpes.length);
                break;
              }
            } else {
              // Default value for single warpes
              overrideIndex = 0;
            }
            checkPreviousDateAndTimeString = dateAndTimeString;
            checkPreviousDateAndTime = new Date(warpDateAndTime.valueOf());
          }
          if (lastWarpDateAndTime >= warpDateAndTime) {
            // Banner already got this warp
            is_done = true;
            break;
          } else {
            extractWarpes.push([textWarp, (overrideIndex > 0 ? overrideIndex:null)]);
          }
        }
        if (!is_done && numberOfWarpPerPage == listOfWarpesLength) {
          end_id = warp['id'];
          page++;
        } else {
          // If list isn't the size requested, it would mean there is no more warpes.
          is_done = true;
        }
      } else {
        is_done = true;
      }
    } else {
      var message = jsonDict["message"];
      var title ="Error code: "+jsonDict["retcode"];
      SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
      if (AUTO_IMPORT_URL_ERROR_CODE_AUTHKEY_DENIED == jsonDict["retcode"]) {
        errorCodeNotEncountered = false;
        is_done = true;
        settingsSheet.getRange(bannerSettings['range_status']).setValue("feedback URL\nNo Longer Works");
      } else if (AUTO_IMPORT_URL_ERROR_CODE_AUTH_TIMEOUT == jsonDict["retcode"]) {
        errorCodeNotEncountered = false;
        is_done = true;
        settingsSheet.getRange(bannerSettings['range_status']).setValue("auth timeout");
      } else if (AUTO_IMPORT_URL_ERROR_CODE_AUTH_INVALID == jsonDict["retcode"]) {
        errorCodeNotEncountered = false;
        is_done = true;
        settingsSheet.getRange(bannerSettings['range_status']).setValue("auth invalid");
      } else if (AUTO_IMPORT_URL_ERROR_CODE_REQUEST_PARAMS == jsonDict["retcode"]) {
        errorCodeNotEncountered = false;
        is_done = true;
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Change server setting");
      }

      failed++;
      if (failed > 2){
        is_done = true;
      }
    }
  }
  if (failed > 2){
    settingsSheet.getRange(bannerSettings['range_status']).setValue("Failed too many times");
  } else {
    if (errorCodeNotEncountered) {
      if (extractWarpes.length > 0) {
        var now = new Date();
        var sixMonthBeforeNow = new Date(now.valueOf());
        sixMonthBeforeNow.setMonth(now.getMonth() - 6);
        var isValid = true;
        var outputString = "Found: "+extractWarpes.length;
        if (!lastWarpDateAndTime) {
          // fresh history sheet no last date to check
          outputString += ", with warp history being empty"
        } else if (lastWarpDateAndTime < sixMonthBeforeNow) {
          // Check if last warp found is more than 6 months, no further validation
          outputString += ", last warp saved was 6 months ago, maybe missing warpes inbetween"
        } else {
          if (warpTextString !== textWarp) {
            if (warpTextString !== oldTextWarp) {
              // API didn't reach to your last warp stored on the sheet, meaning the API is incomplete
              isValid = false;
              outputString = "Error your recently found warpes did not reach to your last warp, found: "+extractWarpes.length+", please try again miHoYo may have sent incomplete warp data.";
            }
          }
        }
        if (isValid) {
          extractWarpes.reverse();
          bannerSheet.getRange(iLastRow, 1, extractWarpes.length, 2).setValues(extractWarpes);
        }
        settingsSheet.getRange(bannerSettings['range_status']).setValue(outputString);
      } else {
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Nothing to add");
      }
    }
  }
}