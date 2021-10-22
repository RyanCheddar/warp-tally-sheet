function importFromAPI() {
  var errorCodeNotEncountered = true;
  var settingsSheet = getSettingsSheet();
  settingsSheet.getRange("E42").setValue(new Date());
  settingsSheet.getRange("E43").setValue("");

  var urlForAPI = settingsSheet.getRange("D35").getValue();
  settingsSheet.getRange("D35").setValue("");
  if (AUTO_IMPORT_URL_FOR_API_BYPASS != "") {
    urlForAPI = AUTO_IMPORT_URL_FOR_API_BYPASS;
  }
  urlForAPI = urlForAPI.toString().split("&");
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
  var bannerName;
  var bannerSheet;
  var bannerSettings;
  if (foundAuth == "") {
    // Display auth key not available
    for (var i = 0; i < WISH_TALLY_NAME_OF_WISH_HISTORY.length; i++) {
      bannerName = WISH_TALLY_NAME_OF_WISH_HISTORY[i];
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
    var urlForWishHistory;
    if (selectedServer == "China") {
      urlForWishHistory = AUTO_IMPORT_URL_CHINA;
    } else {
      urlForWishHistory = AUTO_IMPORT_URL;
    }
    urlForWishHistory += "?"+AUTO_IMPORT_ADDITIONAL_QUERY.join("&")+"&authkey="+foundAuth+"&lang="+languageSettings['code'];
    errorCodeNotEncountered = true;
    // Clear status
    for (var i = 0; i < WISH_TALLY_NAME_OF_WISH_HISTORY.length; i++) {
      bannerName = WISH_TALLY_NAME_OF_WISH_HISTORY[i];
      bannerSettings = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[bannerName];
      settingsSheet.getRange(bannerSettings['range_status']).setValue("");
    }
    for (var i = 0; i < WISH_TALLY_NAME_OF_WISH_HISTORY.length; i++) {
      if (errorCodeNotEncountered) {
        bannerName = WISH_TALLY_NAME_OF_WISH_HISTORY[i];
        bannerSettings = AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT[bannerName];
        var isToggled = settingsSheet.getRange(bannerSettings['range_toggle']).getValue();
        if (isToggled == true) {
          bannerSheet = SpreadsheetApp.getActive().getSheetByName(bannerName);
          if (bannerSheet) {
            checkPages(urlForWishHistory, bannerSheet, bannerName, bannerSettings, languageSettings, settingsSheet);
          } else {
            settingsSheet.getRange(bannerSettings['range_status']).setValue("Missing sheet");
          }
        } else {
          settingsSheet.getRange(bannerSettings['range_status']).setValue("Skipped");
        }
      } else {
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Skipped - Error");
      }
    }
  }
  settingsSheet.getRange("E43").setValue(new Date());
}

function checkPages(urlForWishHistory, bannerSheet, bannerName, bannerSettings, languageSettings, settingsSheet) {
  settingsSheet.getRange(bannerSettings['range_status']).setValue("Starting");
  /* Get latest wish from banner */
  var iLastRow = bannerSheet.getRange(2, 5, bannerSheet.getLastRow(), 1).getValues().filter(String).length;
  var lastWishDateAndTimeString;
  var lastWishDateAndTime;
  if (iLastRow && iLastRow != 0 ) {
    iLastRow++;
    lastWishDateAndTimeString = bannerSheet.getRange("E" + iLastRow).getValue();
    if (lastWishDateAndTimeString) {
      settingsSheet.getRange(bannerSettings['range_status']).setValue("Last wish: "+lastWishDateAndTimeString);
      lastWishDateAndTimeString = lastWishDateAndTimeString.split(" ").join("T");
      lastWishDateAndTime = new Date(lastWishDateAndTimeString+".000Z");
    } else {
      iLastRow = 1;
      settingsSheet.getRange(bannerSettings['range_status']).setValue("No previous wishes");
    }
    iLastRow++; // Move last row to new row
  } else {
    iLastRow = 2; // Move last row to new row
    settingsSheet.getRange(bannerSettings['range_status']).setValue("");
  }
  
  var extractWishes = [];
  var page = 1;
  var queryBannerCode = bannerSettings["gacha_type"];
  var numberOfWishPerPage = 6;
  var urlForBanner = urlForWishHistory+"&gacha_type="+queryBannerCode+"&size="+numberOfWishPerPage;
  var failed = 0;
  var is_done = false;
  var end_id = 0;
  
  var checkPreviousDateAndTimeString = "";
  var overrideIndex = 0;
  while (!is_done) {
    settingsSheet.getRange(bannerSettings['range_status']).setValue("Loading page: "+page);
    var response = UrlFetchApp.fetch(urlForBanner+"&page="+page+"&end_id="+end_id);
    var jsonResponse = response.getContentText();
    var jsonDict = JSON.parse(jsonResponse);
    var jsonDictData = jsonDict["data"];
    if (jsonDictData) {
      var listOfWishes = jsonDictData["list"];
      var isDone = false;
      var listOfWishesLength = listOfWishes.length;
      var wish;
      if (listOfWishesLength > 0) {
        for (var i = 0; i < listOfWishesLength; i++) {
          wish = listOfWishes[i];
          var dateAndTimeString = wish['time'];
          var textWish = wish['item_type']+wish['name'];
          /* Mimic the website in showing specific language wording */
          if (wish['rank_type'] == 4) {
            textWish += languageSettings["4_star"];
          } else if (wish['rank_type'] == 5) {
            textWish += languageSettings["5_star"];
          }
          textWish += dateAndTimeString;

          var dateAndTimeStringModified = dateAndTimeString.split(" ").join("T");
          var wishDateAndTime = new Date(dateAndTimeStringModified+".000Z");
          if (checkPreviousDateAndTimeString === dateAndTimeString) {
            if (overrideIndex == 0) {
              var previousWishIndex = extractWishes.length - 1;
              var previousWish = extractWishes[previousWishIndex];
              overrideIndex = 10;
              previousWish[1] = overrideIndex;
              extractWishes[previousWishIndex] = previousWish;
            }
            overrideIndex--;
          } else {
            checkPreviousDateAndTimeString = dateAndTimeString;
            overrideIndex = 0;
          }
          if (lastWishDateAndTime >= wishDateAndTime ) {
            // Banner already got this wish
            is_done = true;
            break;
          } else {
            extractWishes.push([textWish, (overrideIndex > 0 ? overrideIndex:null)]);
          }
        }
        if (numberOfWishPerPage == listOfWishesLength) {
          // There could be more wishes on the next page
          end_id = wish['id'];
          page++;
        } else {
          // If list isn't the size requested, it would mean there is no more wishes.
          is_done = true;
        }
      } else {
        is_done = true;
      }
    } else {
      var message = jsonDict["message"];
      var title ="Error code: "+jsonDict["retcode"];
      SpreadsheetApp.getActiveSpreadsheet().toast(message, title);
      if (AUTO_IMPORT_URL_ERROR_CODE_AUTH_TIMEOUT == jsonDict["retcode"]) {
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
      if (extractWishes.length > 0) {
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Found: "+extractWishes.length);
        extractWishes.reverse();
        bannerSheet.getRange(iLastRow, 1, extractWishes.length, 2).setValues(extractWishes);
      } else {
        settingsSheet.getRange(bannerSettings['range_status']).setValue("Nothing to add");
      }
    }
  }
}