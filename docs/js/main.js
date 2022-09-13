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

    const noKanaList = splitsList[0]
    const kanaList = splitsList[1]

    var kanaElement = document.getElementById("kanaAll")
    inputKanaSet = getKanaSetFromStr(kanaElement.value)

    const kanaSet = getKanaSet(inputKanaSet, kanaList)
    kanaElement.value = getKanaStr(kanaSet)
    kanaElement.size = kanaSet.length * 2 + 10

    var numberList = []
    for (const kana of kanaList) {
        numberList.push(transKana(kana, kanaSet))
    }

    var displayElement =  document.getElementById("display")
    displayElement.innerText = ''
    for (let index = 0; index < kanaList.length; index++) {
        displayElement.appendChild(convertNoKana(noKanaList[index]))
        displayElement.appendChild(convertNumber(numberList[index]))
    }

    const counts = countKana(kanaSet, kanaList)
    var countElement = document.getElementById("countKana")
    countElement.innerText = ''
    for (let [count, kanaArray] of counts) {
        var element = document.createElement("div")
        element.innerText = count +  "個：" + kanaArray.join('、')
        countElement.appendChild(element)
    }
}
