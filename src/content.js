/*
let url = document.location.href

fetch('https://raw.githubusercontent.com/sir-kokabi/no-delete/main/urls.txt')
    .then(response => {
        response.json()
            .then(entries => {
                let urls = []
                entries.forEach(entry => {
                    if (entry.keytype != "easy-label")
                        urls.push(entry.website)
                })

                if (urls.find(u => u.includes(url)))
                    displayAlert()
            })
    })

/*function updateSites() {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function (e) {
        if (this.status == "200") {
            sites = JSON.parse(this.response);

            // Update our local cache.
            localStorage['sites'] = JSON.stringify(sites);
            localStorage['lastUpdated'] = (new Date() * 1);
        }
    }, false);
    req.open("GET", "https://raw.githubusercontent.com/jdm-contrib/jdm/master/_data/sites.json", true);
    req.send();
}*/



