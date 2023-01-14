let blackList = []
let whiteList = []

async function updateLists() {
    let blackRes = await fetch('https://raw.githubusercontent.com/sir-kokabi/no-delete/main/black-list.txt')
    let whiteRes = await fetch('https://raw.githubusercontent.com/sir-kokabi/no-delete/main/white-list.txt')
    if (blackList.ok && whiteList.ok) {        
        chrome.storage.local.set({ 'blackList': await blackRes.text() })
        chrome.storage.local.set({ 'whiteList': await whiteRes.text() })
        chrome.storage.local.set({ 'lastUpdated': (new Date() * 1) })
    }    
}

async function runUpdater() {
    let black = (await chrome.storage.local.get('blackList')).blackList
    let white = (await chrome.storage.local.get('whiteList')).whiteList
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
    await runUpdater()
}
)()



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{    
    if (changeInfo.status == 'loading'){
        //let domain = getHostname(tab.url)
        
        if (blackList.find(u => tab.url.includes(u))){
            chrome.action.setTitle({tabId:tabId, title:"You can NOT (easily) delete your account on this website! 😠"})
            chrome.action.setBadgeText({tabId: tabId, text:"NO"})
            chrome.action.setBadgeBackgroundColor({tabId: tabId, color: '#FE0000'})           
        
        } else if(whiteList.find(u => tab.url.includes(u))){
            chrome.action.setTitle({tabId:tabId, title:"You CAN easily delete your account on this website 😍"})
            chrome.action.setBadgeText({tabId: tabId, text:"YES"})
            chrome.action.setBadgeBackgroundColor({tabId: tabId, color: '#00FF00'})   
        }else{
            chrome.action.setTitle({tabId:tabId, title:"Click and report if you know!"})
            chrome.action.setBadgeText({tabId: tabId, text:"?"})
            chrome.action.setBadgeBackgroundColor({tabId: tabId, color: '#000000'})  
        }

    }
})
