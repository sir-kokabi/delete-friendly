let blackList = []
let whiteList = []

async function updateLists() {
    let blackRes = await fetch('https://raw.githubusercontent.com/sir-kokabi/no-delete/main/black-list.txt')
    let whiteRes = await fetch('https://raw.githubusercontent.com/sir-kokabi/no-delete/main/white-list.txt')
    if (blackRes.ok && whiteRes.ok) {
        chrome.storage.local.set({ 'blackList': await blackRes.text() })
        chrome.storage.local.set({ 'whiteList': await whiteRes.text() })
        chrome.storage.local.set({ 'lastUpdated': (new Date() * 1) })
    }
}

async function runUpdater() {
    let black = (await chrome.storage.local.get('blackList')).blackList
    let white = (await chrome.storage.local.get('whiteList')).whiteList
    console.log(white);
    if (typeof black != 'undefined' && typeof white != 'undefined') {
        blackList = black.split('\n')
        whiteList = white.split('\n')

        let lastUpdated = (await chrome.storage.local.get('lastUpdated')).lastUpdated

        if (typeof lastUpdated == 'undefined' || lastUpdated < new Date().setDate(new Date().getDate() - 1)) {
            await updateLists()
        }

    } else {
        await updateLists()
    }
}

(async () => {
    await runUpdater()}
)()


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'loading') {
        //TODO: Extract the main domain and compare with it; for example: https://www.panel.domain.co.uk.com => domain.co.uk.com
        if (blackList.find(u => tab.url.includes(u))) {
            setBadge(tabId, 'You can NOT (easily) delete your account on this website! 😠', 'NO', '#FE0000')

        } else if (whiteList.find(u => tab.url.includes(u))) {
            setBadge(tabId, 'You CAN easily delete your account on this website 😍', 'YES', '#00FE00')

        } else {
            setBadge(tabId, 'Click and report if you know 🙏', '❔', '#000000')           
        }

    }
})

function setBadge(tabId, title, text, backgroundColor) {
    chrome.action.setTitle({ tabId: tabId, title: title })
    chrome.action.setBadgeText({ tabId: tabId, text: text })
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: backgroundColor })
}
