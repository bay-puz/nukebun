document.getElementById("inputText").addEventListener("input", show)
document.getElementById("kanaAll").addEventListener("change", show)

function main() {
    var params = new URLSearchParams(document.location.search);
    if (params.has("t")) {
        document.getElementById("inputText").value = params.get("t")
    }
    if (params.has("k")) {
        document.getElementById("kanaAll").value = params.get("k")
    }
    show()
}
main();

function show() {
    const inputText = document.getElementById("inputText").value
    const splitsList = splitText(inputText)

    const noKanaWord = splitsList[0]
    const kanaWord = splitsList[1]

    var kanaElement = document.getElementById("kanaAll")
    inputKanaSet = getKanaSetFromStr(kanaElement.value)

    const kanaSet = getKanaSet(inputKanaSet, kanaWord)
    kanaElement.value = getKanaStr(kanaSet)
    kanaElement.size = kanaSet.length * 2 + 2

    var numberList = []
    for (const kana of kanaWord) {
        numberList.push(transKana(kana, kanaSet))
    }

    var displayElement =  document.getElementById("display")
    displayElement.innerText = ''
    for (let index = 0; index < kanaWord.length; index++) {
        displayElement.appendChild(convertNoKana(noKanaWord[index]))
        displayElement.appendChild(convertNumber(numberList[index]))
    }
    if (kanaWord.length < noKanaWord.length) {
        displayElement.appendChild(convertNoKana(noKanaWord[noKanaWord.length - 1]))
    }

    var answerElement = document.getElementById("answer")
    answerElement.innerText = ''

    var headElement = document.createElement("tr")
    var bodyElement = document.createElement("tr")
    for (let index = 0; index < kanaSet.length; index++) {
        const kana = kanaSet[index]
        var thElement = document.createElement("th")
        thElement.innerText = index + 1
        headElement.appendChild(thElement)
        var tdElement = document.createElement("td")
        var hiddenKanaElement = document.createElement("span")
        hiddenKanaElement.innerText = kana
        hiddenKanaElement.classList.add("hidden")
        tdElement.appendChild(hiddenKanaElement)
        bodyElement.appendChild(tdElement)
    }
    var theadElement = document.createElement("thead")
    theadElement.appendChild(headElement)
    var tbodyElement = document.createElement("tbody")
    tbodyElement.appendChild(bodyElement)

    var tableElement = document.createElement("table")
    tableElement.appendChild(theadElement)
    tableElement.appendChild(tbodyElement)
    answerElement.appendChild(tableElement)

    const counts = countKana(kanaSet, kanaWord)
    var countElement = document.getElementById("countKana")
    countElement.innerText = ''
    for (let [count, kanaArray] of counts) {
        var element = document.createElement("div")
        element.innerText = count +  "個：" + kanaArray.join('、')
        countElement.appendChild(element)
    }

    const wordRelations  = getWordRelations(kanaWord)

    const sameList = wordRelations.same
    var sameElement = document.getElementById("sameWord")
    sameElement.innerText = (sameList.length > 0) ? sameList.join('、') : "なし"

    const sameKind = wordRelations.sameKind
    var sameKindList = new Array()
    for (const same of sameKind) {
        sameKindList.push(same.join('・'))
    }
    var sameKindElement = document.getElementById("sameKindWord")
    sameKindElement.innerText = (sameKindList.length > 0) ? sameKindList.join('、') : "なし"

    const includedMap = wordRelations.included
    var includedList = new Array()
    for (const [word, includings] of includedMap) {
        includedList.push(word + "（" + includings.join('、') + "）")
    }
    var includedElement = document.getElementById("includedWord")
    includedElement.innerText = (includedList.length > 0) ? includedList.join('、') : "なし"
}
