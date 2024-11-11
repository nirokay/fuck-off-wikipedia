const idDonationBanner: string = "wmde-banner-app";
const cookieIndex: string = "centralnotice_hide_fundraising";

const removeBannerAttempts: number = 20;
const removeBannerSleepMS: number = 500;

let date: Date = new Date;

interface Dictionary<T> {
    [key: string]: T|null;
}


function removeBanner() {
    let element: HTMLElement|null = document.getElementById(idDonationBanner);
    if(element == null) {return}
    // Try-catch, because another extension might beat me to the race:
    try {
        element.remove();
    } catch(error) {
        console.error([
            "[Fuck-Off-Wikipedia] Located, but failed to remove, donation banner by id '" + idDonationBanner + "'",
            error
        ]);
    }
}
async function tryRemovingBannerOverTime() {
    for (let attempt = 1; attempt < removeBannerAttempts; attempt++) {
        let msTimeout: number = attempt * removeBannerSleepMS;
        setTimeout(() => {
            removeBanner();
        }, msTimeout);
    }
}


function generateCookie(): string {
    let donationDate: number = date.getTime() / 1000 - 69; // Set a bit backwards, so it seems a bit more believable(?) (also, nice!)
    return cookieIndex + "=" + encodeURI(`{"v":1,"created":${donationDate.toString()},"reason":"donate"};`);
}
function injectCookie() {
    //                           y     d    h    m    s     ms
    let expirationDate: number = 5 * 365 * 24 * 60 * 60 * 1000 + date.getTime()
    document.cookie = generateCookie() + ` expires=${expirationDate.toString()};`;
}

function getCookie(): Dictionary<string> {
    let cookieParts: string[] = document.cookie.split("; ");
    let dictionary: Dictionary<string> = {};
    cookieParts.forEach(raw => {
        let parts: string[] = raw.split("=");
        if(parts.length == 0) {
            console.error([
                "[Fuck-Off-Wikipedia] Cookie part corrupted?",
                parts
            ]);
            return;
        }
        if(parts.length < 2) {
            dictionary[parts[0]] = null;
            return;
        }
        dictionary[parts[0]] = parts.splice(1).join("=");
    });
    return dictionary;
}
function hasCookie(): boolean {
    return cookieIndex in getCookie();
}

async function main() {
    console.log("[Fuck-Off-Wikipedia] Starting main()");
    // Attempt removing banner in background:
    let promise: Promise<void> = tryRemovingBannerOverTime();

    // Inject cookie in the meantime:
    if(!hasCookie()) {
        injectCookie();
    }

    // Sync up with background and exit:
    await promise;
}

main();
