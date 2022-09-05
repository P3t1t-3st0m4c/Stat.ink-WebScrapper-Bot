const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { URL } = require("url");

const wordRegex = /^[a-z0-9]{6,}$/i
const localisation = {
    "en-US" : "en-US",
    "en-GB" : "en-GB",
    fr : "fr-FR",
    es : "es-ES",
    it : "it-IT",
    ja : "ja-JP",
    de : "de-DE",
    ru : "ru-RU",
}

const retrieveHtml = async (url, loc) => {
    loc = loc in localisation ? localisation[loc] : "en-US"
    url = new URL(url)
    url.searchParams.append("_lang_", loc);
    url.searchParams.append("amp;_lang", loc);
    url = url.toString()
    console.log(url)
    return fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.text()}
            return 404})
        .then(html => {return html})
}

const checkNameAndGetHtml = async (name, url, loc) => {
    if (name.match(wordRegex)[0] != name){
        return {"error" : ["RegexError",`${name} don't match regex`]}
    }
    url = url(name)
    const html = await retrieveHtml(url, loc)
    if (html == 404) return {"error" : ["404Error",`User ${name} not found`]}
    return {"success" : {"html" : html, "url" : url}}

}

// Standard data
const retrieveStandardData = async (name, loc) => {
    let html = await checkNameAndGetHtml(name, (x) => `https://stat.ink/@${x}`, loc)
    if (html.error) return html
    const standardInfo = new JSDOM(
        html.success.html,
    ).window.document;
    var splatoonData = []
    var splatoon2Data = [];
    var profileImageUrl = standardInfo.querySelector("#person-box > meta").content
    try {
        const splat2Table = standardInfo.querySelectorAll("#splatoon2 > .battles-summary > div")
        for (let box of splat2Table) {
            let _box = box.querySelectorAll("div")
            splatoon2Data.push(
                {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
        }
    } catch (error) {
        splatoon2Data = ["No data available", ""]
    }try{
        let splatTable = standardInfo.querySelectorAll("#splatoon > .battles-summary > div")
        for (let box of splatTable) {
            let _box = box.querySelectorAll("div")
            splatoonData.push(
                {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
        }
    } catch (error) {
        splatoonData = ["No data available", ""]
    }
    return {"success": 
        {
            "title" : standardInfo.title,
            "url" : html.success.url,
            "imageUrl" : profileImageUrl,
            "data" : {
                "Splatoon" : splatoonData,
                "Splatoon 2" : splatoon2Data
            }
        }
    }
}

const advancedDataSplat1 = async (name, loc) => {
    let html = await checkNameAndGetHtml(name, (x) => `https://stat.ink/@${x}/spl1`, loc)
    if (html.error) return html
    const advancedInfoSplat1 = new JSDOM(
        html.success.html
    ).window.document;
    try {
        var profileImageUrl = advancedInfoSplat1.querySelector(".miniinfo-user-icon > meta").content
        let advancedInfoSplat1Data = {"Info" : []};
        const advancedSplatTable = Array.from(advancedInfoSplat1.querySelectorAll("#user-miniinfo-box > .row"))
        let infoSplat = Array.from(advancedSplatTable.slice(0,2))
            .map(row => Array.from(row.querySelectorAll(":scope > div"))).flat()
        let terrSplat = advancedSplatTable.slice(2,4)
        let proSplat = advancedSplatTable.slice(4,6)
        // Retrieve the second row and its first column (title)
        let terrSplatTitle = terrSplat[0].textContent.trim()
        terrSplat = terrSplat[1].querySelectorAll(":scope > div")
        advancedInfoSplat1Data[terrSplatTitle] = []
        // Retrieve the third row and its first column (title)
        let proSplatTitle = proSplat[0].textContent.trim()
        proSplat = proSplat[1].querySelectorAll(":scope > div")
        advancedInfoSplat1Data[proSplatTitle] = []
        for (let box of infoSplat){
            let _box = box.querySelectorAll("div")
            if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
                advancedInfoSplat1Data["Info"].push(
                    {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
            }
            
        }
        for (let box of terrSplat){
            let _box = box.querySelectorAll("div")
            if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
                advancedInfoSplat1Data[terrSplatTitle].push(
                    {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
            }
        }
        for (let box of proSplat){
            let _box = box.querySelectorAll("div")
            if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
                advancedInfoSplat1Data[proSplatTitle].push(
                    {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
            }
        }
        return {"success" :
            {
                "title" : advancedInfoSplat2.title,
                "url" : html.success.url,
                "imageUrl" : profileImageUrl,
                "data" : advancedInfoSplat1Data
            }
        }
    }catch (error) {
        return {"error" : ["RetrieveError", error, "No Data Available"]};
    }
}

const advancedDataSplat2 = async (name, loc) => {
    let html = await checkNameAndGetHtml(name, (x) => `https://stat.ink/@${x}/spl2`, loc)
    if (html.error) return html
    const advancedInfoSplat2 = new JSDOM(
        html.success.html
    ).window.document;
    try {
        var profileImageUrl = advancedInfoSplat2.querySelector(".miniinfo-user-icon > meta").content
        let advancedInfoSplat2Data = {"Info" : []};
        const advancedSplat2Table = advancedInfoSplat2.querySelectorAll("#user-miniinfo-box > .row")
        let infoSplat2 = advancedSplat2Table[0].querySelectorAll(":scope > div > div")
        let terrSplat2 = advancedSplat2Table[1].querySelectorAll(":scope > div")
        let proSplat2 = advancedSplat2Table[2].querySelectorAll(":scope > div")
        // Retrieve the second row and its first column (title)
        let titleTerrSplat2 = terrSplat2[0].textContent.trim() 
        advancedInfoSplat2Data[titleTerrSplat2] = []
        // Retrieve the third row and its first column (title)
        let titleProSplat2 = proSplat2[0].textContent.trim()
        advancedInfoSplat2Data[titleProSplat2] = []
        terrSplat2 = terrSplat2[1].querySelectorAll(":scope > div")
        proSplat2 = proSplat2[1].querySelectorAll(":scope > div")
        for (let box of infoSplat2){
            let _box = box.querySelectorAll("div")
            if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
                advancedInfoSplat2Data["Info"].push(
                    {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
                }
        }
        for (let box of terrSplat2){
            let _box = box.querySelectorAll("div")
            if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
            advancedInfoSplat2Data[titleTerrSplat2].push(
                {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
            }
        }
        for (let box of proSplat2){
            let _box = box.querySelectorAll("div")
            let _img = box.querySelector("img")
            if (_img) {
                advancedInfoSplat2Data[titleProSplat2].push(
                    {[_box[0].textContent.trim()] : _img.alt})
            }else{
                if (_box[0].textContent.trim().length > 1 || _box[0].textContent.trim().length > 1){
                    advancedInfoSplat2Data[titleProSplat2].push(
                        {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
                }
            }
        }
        return {"success" :
        {
            "title" : advancedInfoSplat2.title,
            "url" : html.success.url,
            "imageUrl" : profileImageUrl,
            "data" : advancedInfoSplat2Data
        }
    }
    }catch (error) {
        return {"error" : ["RetrieveError", error, "No data Available"]};
    }
}

const advancedDataSalmon = async (name, loc) => {
    let html = await checkNameAndGetHtml(name, (x) => `https://stat.ink/@${x}/salmon`, loc)
    if (html.error) return html
    const advancedInfoSalmon = new JSDOM(
        html.success.html
    ).window.document;
    try {
        var profileImageUrl =  advancedInfoSalmon.querySelector(".miniinfo-user-icon > img").src
        let advancedSalmonData = []
        const advancedSalmonTable = advancedInfoSalmon.querySelectorAll("#user-miniinfo-box > .row > div")
        for (let box of advancedSalmonTable){
            let _box = box.querySelectorAll("div")
            // Box should contain 2 elements
            if (_box.length == 2 && (_box[0].textContent.trim().length > 1 || _box[1].textContent.trim().length > 1)){
                advancedSalmonData.push(
                    {[_box[0].textContent.trim()] : _box[1].textContent.trim()})
            } 
        }
        return {"success" :
            {
                "title" : advancedInfoSalmon.title,
                "url" : html.success.url,
                "imageUrl" : new URL(html.success.url).origin+profileImageUrl,
                "data" : {
                    "Salmon Run" : advancedSalmonData,
                }
            }
        }
    }catch (error) {
        return {"error" : ["RetrieveError", error, "No data Available"]};
    }
}

module.exports = {
    retrieveStandardData: retrieveStandardData,
    advancedDataSplat1: advancedDataSplat1,
    advancedDataSplat2: advancedDataSplat2,
    advancedDataSalmon: advancedDataSalmon
}