"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const idDonationBanner = "wmde-banner-app";
const cookieIndex = "centralnotice_hide_fundraising";
const removeBannerAttempts = 20;
const removeBannerSleepMS = 500;
let date = new Date;
function removeBanner() {
    let element = document.getElementById(idDonationBanner);
    if (element == null) {
        console.log("[Fuck-Off-Wikipedia] No banner found...");
        return;
    }
    // Try-catch, because another extension might beat me to the race:
    try {
        element.remove();
        console.log("[Fuck-Off-Wikipedia] Removed donation banner!");
    }
    catch (error) {
        console.error([
            "[Fuck-Off-Wikipedia] Located, but failed to remove, donation banner by id '" + idDonationBanner + "'",
            error
        ]);
    }
}
function tryRemovingBannerOverTime() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let attempt = 1; attempt < removeBannerAttempts; attempt++) {
            let msTimeout = attempt * removeBannerSleepMS;
            setTimeout(() => {
                removeBanner();
            }, msTimeout);
        }
    });
}
function generateCookie() {
    let donationDate = date.getTime() / 1000 - 69; // Set a bit backwards, so it seems a bit more believable(?) (also, nice!)
    return cookieIndex + "=" + encodeURI(`{"v":1,"created":${donationDate.toString()},"reason":"donate"};`);
}
function injectCookie() {
    //                           y     d    h    m    s     ms
    let expirationDate = 5 * 365 * 24 * 60 * 60 * 1000 + date.getTime();
    document.cookie = generateCookie() + ` expires=${expirationDate.toString()};`;
}
function getCookie() {
    let cookieParts = document.cookie.split("; ");
    let dictionary = {};
    cookieParts.forEach(raw => {
        let parts = raw.split("=");
        if (parts.length == 0) {
            console.error([
                "[Fuck-Off-Wikipedia] Cookie part corrupted?",
                parts
            ]);
            return;
        }
        if (parts.length < 2) {
            dictionary[parts[0]] = null;
            return;
        }
        dictionary[parts[0]] = parts.splice(1).join("=");
    });
    return dictionary;
}
function hasCookie() {
    return cookieIndex in getCookie();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("[Fuck-Off-Wikipedia] Starting tasks...");
        // Attempt removing banner in background:
        let promise = tryRemovingBannerOverTime();
        // Inject cookie in the meantime:
        if (!hasCookie()) {
            injectCookie();
        }
        // Sync up with background and exit:
        yield promise;
        console.log("[Fuck-Off-Wikipedia] Finished execution, have a great day :3");
    });
}
document.onload = () => {
    main();
};
