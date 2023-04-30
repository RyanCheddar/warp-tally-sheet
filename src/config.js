/*
 * Version 3.61 made by yippym - 2023-02-57 23:00
 * https://github.com/Yippy/warp-tally-sheet
 */
// Warp Tally Const
var WARP_TALLY_SHEET_SOURCE_REDIRECT_ID = '1uw8yqiRwda8Pi68koih4hWivNr9-JCFL3ULbzfAmPU8';
var WARP_TALLY_SHEET_SUPPORTED_LOCALE = "en_GB";
var WARP_TALLY_SHEET_SCRIPT_VERSION = 1.00;
var WARP_TALLY_SHEET_SCRIPT_IS_ADD_ON = false;

// Auto Import Const
/* Add URL here to avoid showing on Sheet */
var AUTO_IMPORT_URL_FOR_API_BYPASS = ""; // Optional
var AUTO_IMPORT_BANNER_SETTINGS_FOR_IMPORT = {
  "Character Event Warp History": { "range_status": "E44", "range_toggle": "E37", "gacha_type": 11 },
  "Regular Warp History": { "range_status": "E45", "range_toggle": "E38", "gacha_type": 1 },
  "Light Cone Event Warp History": { "range_status": "E46", "range_toggle": "E39", "gacha_type": 12 },
  "Beginner Warp History": { "range_status": "E47", "range_toggle": "E40", "gacha_type": 2 },
};

var AUTO_IMPORT_LANGUAGE_SETTINGS_FOR_IMPORT = {
  "English": { "code": "en", "full_code": "en-us", "4_star": " (4-Star)", "5_star": " (5-Star)", "gacha_type_400": "Character Event Warp-2", "gacha_type_11": "Character Event Warp", "gacha_type_12": "Light Cone Event Warp", "gacha_type_1": "Regular Warp", "gacha_type_2": "Beginner Warpes" },
  "German": { "code": "de", "full_code": "de-de", "4_star": " (4 Sterne)", "5_star": " (5 Sterne)", "gacha_type_400": "Figurenaktionsgebet 2", "gacha_type_11": "Figurenaktionsgebet", "gacha_type_12": "Waffenaktionsgebet", "gacha_type_1": "Standardgebet", "gacha_type_2": "Neulingsgebete" },
  "French": { "code": "fr", "full_code": "fr-fr", "4_star": " (4★)", "5_star": " (5★)", "gacha_type_400": "Vœux événements de personnage - 2", "gacha_type_11": "Vœux événements de personnage", "gacha_type_12": "Vœux événements d'arme", "gacha_type_1": "Vœux permanents", "gacha_type_2": "Vœux des débutants" },
  "Spanish": { "code": "es", "full_code": "es-es", "4_star": " (4★)", "5_star": " (5★)", "gacha_type_400": "Gachapón promocional de personaje 2", "gacha_type_11": "Gachapón promocional de personaje", "gacha_type_12": "Gachapón promocional de arma", "gacha_type_1": "Gachapón permanente", "gacha_type_2": "Gachapón de principiante" },
  "Chinese Traditional": { "code": "zh-tw", "full_code": "zh-tw", "4_star": " (四星)", "5_star": " (五星)", "gacha_type_400": "角色活動祈願-2", "gacha_type_11": "角色活動祈願", "gacha_type_12": "武器活動祈願", "gacha_type_1": "常駐祈願", "gacha_type_2": "新手祈願" },
  "Chinese Simplified": { "code": "zh-cn", "full_code": "zh-cn", "4_star": " (四星)", "5_star": " (五星)", "gacha_type_400": "角色活动祈愿-2", "gacha_type_11": "角色活动祈愿", "gacha_type_12": "武器活动祈愿", "gacha_type_1": "常驻祈愿", "gacha_type_2": "新手祈愿" },
  "Indonesian": { "code": "id", "full_code": "id-id", "4_star": " (4★)", "5_star": " (5★)", "gacha_type_400": "Event Permohonan Karakter - 2", "gacha_type_11": "Event Permohonan Karakter", "gacha_type_12": "Event Permohonan Senjata", "gacha_type_1": "Permohonan Standar", "gacha_type_2": "Permohonan Pemula" },
  "Japanese": { "code": "ja", "full_code": "ja-jp", "4_star": " (★4)", "5_star": " (★5)", "gacha_type_400": "イベント祈願・キャラクター 2", "gacha_type_11": "イベント祈願・キャラクター", "gacha_type_12": "イベント祈願・武器", "gacha_type_1": "通常祈願", "gacha_type_2": "初心者向け祈願" },
  "Vietnamese": { "code": "vi", "full_code": "vi-vn", "4_star": " (4 sao)", "5_star": " (5 sao)", "gacha_type_400": "Cầu Nguyện Nhân Vật-2", "gacha_type_11": "Cầu Nguyện Nhân Vật", "gacha_type_12": "Cầu Nguyện Vũ Khí", "gacha_type_1": "Cầu Nguyện Thường", "gacha_type_2": "Cầu Nguyện Tân Thủ" },
  "Korean": { "code": "ko", "full_code": "ko-kr", "4_star": " (★4)", "5_star": " (★5)", "gacha_type_400": "캐릭터 이벤트 기원-2", "gacha_type_11": "캐릭터 이벤트 기원", "gacha_type_12": "무기 이벤트 기원", "gacha_type_1": "상주 기원", "gacha_type_2": "초심자 기원" },
  "Portuguese": { "code": "pt", "full_code": "pt-pt", "4_star": " (4★)", "5_star": " (5★)", "gacha_type_400": "Oração de Evento de Personagem - 2", "gacha_type_11": "Oração de Evento de Personagem", "gacha_type_12": "Oração do Evento de Arma", "gacha_type_1": "Desejo Comum", "gacha_type_2": "Desejos de Novato" },
  "Thai": { "code": "th", "full_code": "th-th", "4_star": " (4 ดาว)", "5_star": " (5 ดาว)", "gacha_type_400": "กิจกรรมอธิษฐานตัวละคร - 2", "gacha_type_11": "กิจกรรมอธิษฐานตัวละคร", "gacha_type_12": "กิจกรรมอธิษฐานอาวุธ", "gacha_type_1": "อธิษฐานถาวร", "gacha_type_2": "ผู้เริ่มอธิษฐาน" },
  "Russian": { "code": "ru", "full_code": "ru-ru", "4_star": " (4★)", "5_star": " (5★)", "gacha_type_400": "Молитва события персонажа II", "gacha_type_11": "Молитва события персонажа", "gacha_type_12": "Молитва события оружия", "gacha_type_1": "Стандартная молитва", "gacha_type_2": "Молитва новичка" },
  "Italian": { "code": "it", "full_code": "it-it", "4_star": " (4 ★)", "5_star": " (5 ★)", "gacha_type_400": "Desiderio evento personaggio 2", "gacha_type_11": "Desiderio evento personaggio", "gacha_type_12": "Desiderio evento arma", "gacha_type_1": "Desiderio standard", "gacha_type_2": "Desideri per viaggiatori novizi" },
  "Turkish": { "code": "tr", "full_code": "tr-tr", "4_star": " (4 Yıldızlı)", "5_star": " (5 Yıldızlı)", "gacha_type_400": "Karakter Etkinliği Dileği-2", "gacha_type_11": "Karakter Etkinliği Dileği", "gacha_type_12": "Silah Etkinliği Dileği", "gacha_type_1": "Kalıcı Dilek", "gacha_type_2": "Acemi Dilekleri" }
};

var AUTO_IMPORT_ADDITIONAL_QUERY = [
  "authkey_ver=1",
  "sign_type=2",
  "auth_appid=webview_gacha",
  "device_type=pc"
];

var AUTO_IMPORT_URL = "https://api-os-takumi.mihoyo.com/common/gacha_record/api/getGachaLog";
var AUTO_IMPORT_URL_CHINA = "https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog";


var AUTO_IMPORT_URL_ERROR_CODE_AUTH_TIMEOUT = -101;
var AUTO_IMPORT_URL_ERROR_CODE_AUTH_INVALID = -100;
var AUTO_IMPORT_URL_ERROR_CODE_LANGUAGE_CODE = -108;
var AUTO_IMPORT_URL_ERROR_CODE_AUTHKEY_DENIED = -109;
var AUTO_IMPORT_URL_ERROR_CODE_REQUEST_PARAMS = -104;

// thesadru/genshinstats https://github.com/thesadru/genshinstats
var HOYOLAB_GAME_RECORD_URL = "https://bbs-api-os.hoyoverse.com/game_record/genshin/api/character";
var HOYOLAB_GAME_RECORD_URL_CHINA = "https://api-takumi.mihoyo.com/game_record/app/genshin/api/character";
var HOYOLAB_GAME_RECORD_DS_SALT = "6cqshh5dhw73bzxn20oexa9k516chk7s";
var HOYOLAB_GAME_RECORD_DS_SALT_CHINA = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";

var UID_SERVER = {
  1: { "is_global": false, "code": "cn_gf01", "url": HOYOLAB_GAME_RECORD_URL_CHINA, "salt": HOYOLAB_GAME_RECORD_DS_SALT_CHINA, "x-rpc-app_version": "2.11.1", "x-rpc-client_type": "5" } ,
  2: { "is_global": false, "code": "cn_gf01", "url": HOYOLAB_GAME_RECORD_URL_CHINA, "salt": HOYOLAB_GAME_RECORD_DS_SALT_CHINA, "x-rpc-app_version": "2.11.1", "x-rpc-client_type": "5" },
  5: { "is_global": false, "code": "cn_qd01", "url": HOYOLAB_GAME_RECORD_URL_CHINA, "salt": HOYOLAB_GAME_RECORD_DS_SALT_CHINA, "x-rpc-app_version": "2.11.1", "x-rpc-client_type": "5" },
  6: { "is_global": true, "code": "prod_official_usa", "url": HOYOLAB_GAME_RECORD_URL, "salt": HOYOLAB_GAME_RECORD_DS_SALT, "x-rpc-app_version": "1.5.0", "x-rpc-client_type": "4" },
  7: { "is_global": true, "code": "prod_official_euro", "url": HOYOLAB_GAME_RECORD_URL, "salt": HOYOLAB_GAME_RECORD_DS_SALT, "x-rpc-app_version": "1.5.0", "x-rpc-client_type": "4" },
  8: { "is_global": true, "code": "prod_official_asia", "url": HOYOLAB_GAME_RECORD_URL, "salt": HOYOLAB_GAME_RECORD_DS_SALT, "x-rpc-app_version": "1.5.0", "x-rpc-client_type": "4" },
  9: { "is_global": true, "code": "prod_official_cht", "url": HOYOLAB_GAME_RECORD_URL, "salt": HOYOLAB_GAME_RECORD_DS_SALT, "x-rpc-app_version": "1.5.0", "x-rpc-client_type": "4"},
};

// Warp Tally Const
var WARP_TALLY_REDIRECT_SOURCE_ABOUT_SHEET_NAME = "About";
var WARP_TALLY_REDIRECT_SOURCE_AUTO_IMPORT_SHEET_NAME = "Auto Import";
var WARP_TALLY_REDIRECT_SOURCE_MAINTENANCE_SHEET_NAME = "Maintenance";
var WARP_TALLY_REDIRECT_SOURCE_HOYOLAB_SHEET_NAME = "HoYoLAB";
var WARP_TALLY_REDIRECT_SOURCE_BACKUP_SHEET_NAME = "Backup";
var WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME = "Character Event Warp History";
var WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME = "Light Cone Event Warp History";
var WARP_TALLY_REGULAR_WARP_SHEET_NAME = "Regular Warp History";
var WARP_TALLY_BEGINNER_WARP_SHEET_NAME = "Beginner Warp History";
var WARP_TALLY_WARP_HISTORY_SHEET_NAME = "Warp History";
var WARP_TALLY_SETTINGS_SHEET_NAME = "Settings";
var WARP_TALLY_DASHBOARD_SHEET_NAME = "Dashboard";
var WARP_TALLY_CHANGELOG_SHEET_NAME = "Changelog";
var WARP_TALLY_PITY_CHECKER_SHEET_NAME = "Pity Checker";

// Optional sheets
var WARP_TALLY_EVENTS_SHEET_NAME = "Events";
var WARP_TALLY_CHARACTERS_OLD_SHEET_NAME = "Eidolon";
var WARP_TALLY_CHARACTERS_SHEET_NAME = "Characters";
var WARP_TALLY_LIGHTCONES_SHEET_NAME = "Light Cones";
var WARP_TALLY_RESULTS_SHEET_NAME = "Results";
// Must match optional sheets names
var SETTINGS_FOR_OPTIONAL_SHEET = {
  "Events": {"setting_option": "B14"},
  "Results": {"setting_option": "B15"},
  "Characters": {"setting_option": "B16"},
  "Light Cones": {"setting_option": "B22"},
}

var WARP_TALLY_README_SHEET_NAME = "README";
var WARP_TALLY_AVAILABLE_SHEET_NAME = "Available";
var WARP_TALLY_SHARD_CALCULATOR_SHEET_NAME = "Shard Calculator";
var WARP_TALLY_ALL_WARP_HISTORY_SHEET_NAME = "All Warp History";
var WARP_TALLY_ITEMS_SHEET_NAME = "Items";
var WARP_TALLY_NAME_OF_WARP_HISTORY = [WARP_TALLY_CHARACTER_EVENT_WARP_SHEET_NAME, WARP_TALLY_REGULAR_WARP_SHEET_NAME, WARP_TALLY_LIGHTCONE_EVENT_WARP_SHEET_NAME, WARP_TALLY_BEGINNER_WARP_SHEET_NAME];
// AutoHotkey Const
var AUTOHOTKEY_SHEET_NAME = "AutoHotkey";
var AUTOHOTKEY_SCRIPT_SHEET_NAME = "AutoHotkey-Script";

// Import Const
var IMPORT_STATUS_COMPLETE = "COMPLETE";
var IMPORT_STATUS_FAILED = "FAILED";
var IMPORT_STATUS_WARP_HISTORY_COMPLETE = "DONE";
var IMPORT_STATUS_WARP_HISTORY_NOT_FOUND = "NOT FOUND";
var IMPORT_STATUS_WARP_HISTORY_EMPTY = "EMPTY";

// Scheduler Const
var SCHEDULER_TRIGGER_ON_TEXT = "ON";
var SCHEDULER_TRIGGER_OFF_TEXT = "OFF";
var SCHEDULER_RUN_AT_WHICH_DAY = {
  "Monday": ScriptApp.WeekDay.MONDAY,
  "Tuesday": ScriptApp.WeekDay.TUESDAY,
  "Wednesday": ScriptApp.WeekDay.WEDNESDAY,
  "Thursday": ScriptApp.WeekDay.THURSDAY,
  "Friday": ScriptApp.WeekDay.FRIDAY,
  "Saturday": ScriptApp.WeekDay.SATURDAY,
  "Sunday": ScriptApp.WeekDay.SUNDAY
};
var SCHEDULER_RUN_AT_HOUR = {
  "Run at 1:00": 1,
  "Run at 2:00": 2,
  "Run at 3:00": 3,
  "Run at 4:00": 4,
  "Run at 5:00": 5,
  "Run at 6:00": 6,
  "Run at 7:00": 7,
  "Run at 8:00": 8,
  "Run at 9:00": 9,
  "Run at 10:00": 10,
  "Run at 11:00": 11,
  "Run at 12:00": 12,
  "Run at 13:00": 13,
  "Run at 14:00": 14,
  "Run at 15:00": 15,
  "Run at 16:00": 16,
  "Run at 17:00": 17,
  "Run at 18:00": 18,
  "Run at 19:00": 19,
  "Run at 20:00": 20,
  "Run at 21:00": 21,
  "Run at 22:00": 22,
  "Run at 23:00": 23,
  "Run at Midnight": 0
};
var SCHEDULER_RUN_AT_EVERY_HOUR = {
  "Every hour": 1,
  "Every 2 hours": 2,
  "Every 3 hours": 3,
  "Every 4 hours": 4,
  "Every 5 hours": 5,
  "Every 6 hours": 6,
  "Every 7 hours": 7,
  "Every 8 hours": 8,
  "Every 9 hours": 9,
  "Every 10 hours": 10,
  "Every 11 hours": 11,
  "Every 12 hours": 12,
  "Every 13 hours": 13,
  "Every 14 hours": 14,
  "Every 15 hours": 15,
  "Every 16 hours": 16,
  "Every 17 hours": 17,
  "Every 18 hours": 18,
  "Every 19 hours": 19,
  "Every 20 hours": 20,
  "Every 21 hours": 21,
  "Every 22 hours": 22,
  "Every 23 hours": 23,
  "Every 24 hours": 24
};

const CACHED_AUTHKEY_TIMEOUT = 1000 * 60 * 60 * 24;
