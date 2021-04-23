let mapCanvas;
let ctx;
let areaTypes = {"Baked Goods": "#db9b3c", "Drinks": "#3be2c0", "Prepared Foods": "#97264d", "Meats": "#a31b1b",
    "Ingredients": "#e86620", "Snacks": "#b7e287", "Produce": "#04d53f", "Seafood": "#1773e3",
    "Dairy": "#b7e9ff", "Other": "#939393",
    "checkout": "#1b7e95", "expressCheckout": "#30e2aa", "entrance": "#00FF00", "exit": "#FF0000"};
//item, isle, shelf, class
let foodCode;// = [["pepper", 0, 0, "spices"], ["salt", 0, 0, "spices"], ["crackers", 0, 1, "grain"], ["oats", 0, 1, "grain"],
    //["walnuts", 1, 2, "nuts"], ["peanuts", 1, 2, "nuts"], ["milk", 7, 0, "dairy"], ["yogurt", 7, 1, "dairy"]];
let mapCode;
function initMap(){
    mapCanvas = document.getElementById("mapCanvas");
    mapCanvas.addEventListener("click", mapClick);
    ctx = mapCanvas.getContext("2d");
    let request = new XMLHttpRequest();
    request.onload = function () {
        if (this.status === 200) {
            //clearDisplay();
            doc = JSON.parse(this.responseText);

            console.log(this.responseText);
            mapCode = JSON.parse(this.responseText);
            drawAreas("0");
            drawAreas("1");
            drawAreas("2");
        }
    }

    request.open("GET", "https://67.245.193.236:9443/mongo/api/layout", true);
    request.send();

    request = new XMLHttpRequest();
    request.onload = function () {
        if (this.status === 200) {
            //clearDisplay();
            doc = JSON.parse(this.responseText);

            console.log(this.responseText);
            foodCode = JSON.parse(this.responseText);

            let importList = ALL_LISTS[EDITING_LIST][3];
            for(let i=0; i<importList.length; i++)
                addItem(importList[i], false);
        }
    }

    request.open("GET", "https://67.245.193.236:9443/mongo/api/food", true);
    request.send();
}
function drawAreas(areaClass){
    let areaKeys = Object.keys(mapCode[areaClass]);
    for(let i=1; i<areaKeys.length; i++){
        let area = mapCode[areaClass][areaKeys[i]];
        let coords = area["coords"];
        let sections = area["sections"];
        let shelfDims = area["sectionDims"];
        let orientation = area["orientation"];
        for(let j=0; j<sections; j++){
            ctx.fillStyle = areaTypes[area["type"]];
            if(orientation === "y")
                ctx.fillRect(coords[0], coords[1]+(j*shelfDims[1]), shelfDims[0], shelfDims[1]);
            else
                ctx.fillRect(coords[0]+(j*shelfDims[0]), coords[1], shelfDims[0], shelfDims[1]);
        }
        if(areaClass === "0"){
            ctx.fillStyle = "#FFFFFF";
            if(orientation === "y")
                ctx.font = (shelfDims[0]*2)+'px serif';
            else
                ctx.font = (shelfDims[1]*2)+'px serif';

            ctx.fillText(""+i, coords[0], coords[1]+shelfDims[1]);
        }
    }
}
function refreshMap(){
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    drawAreas("0");
    drawAreas("1");
    drawAreas("2");
    for(let i=0; i<cardList.length; i++){
        let item = cardList[i][0].id.substring(0, cardList[i][0].id.lastIndexOf("Card"))
        for (let j = 0; j < foodCode.length; ++j) {
            if(foodCode[j]["product"].toLowerCase() === item.toLowerCase()) {
                markCoords(foodCode[j]["asiles"], foodCode[j]["shelf"])
            }
        }
    }
}
function markCoords(isleNum, shelfNum){
    if(Object.keys(mapCode["0"]).indexOf("isle"+isleNum) !== -1) {
        let isle = mapCode["0"]["isle" + isleNum];
        let coords = getShelfCoords(isleNum, shelfNum)
        ctx.fillStyle = "red";
        ctx.beginPath();
        console.log("Marking isle "+isleNum+", shelf "+shelfNum+", at x "+coords[0]+", y "+coords[1])
        if (isle["orientation"] === "y")
            ctx.arc(coords[0]+isle["sectionDims"][0]/2, coords[1]+((shelfNum+.5)*isle["sectionDims"][1]), 2, 0, 2 * Math.PI);
        else
            ctx.arc(coords[0]+((shelfNum+.5)*isle["sectionDims"][0]), coords[1]+isle["sectionDims"][1]/2, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}
function getShelfCoords(isleNum, shelfNum){
    if(Object.keys(mapCode["0"]).indexOf("isle"+isleNum) !== -1) {
        let isle = mapCode["0"]["isle" + isleNum];
        if (isle["sections"] > shelfNum) {
            console.log("Coords of isle "+isleNum+" and shelf "+shelfNum+" is x "+isle["coords"][0]+", y "+isle["coords"][1]);
            return isle["coords"];
        }
    }
}
function getProductInfo(product){
    for (let index = 0; index < foodCode.length; ++index) {
        if(foodCode[index]["product"].toLowerCase() === product.toLowerCase()) {
            let coords = getShelfCoords(foodCode[index]["asiles"], foodCode[index]["shelf"]);
            coords.push(foodCode[index]["class"]);
            coords.push(index);
            return coords;
        }
    }
}
function mapClick(event) {
    let coords = [mapCanvas.getBoundingClientRect().left, mapCanvas.getBoundingClientRect().top, mapCanvas.getBoundingClientRect().width, mapCanvas.getBoundingClientRect().height]
    let x = (event.clientX-coords[0])/coords[2]*300;
    let y = (event.clientY-coords[1])/coords[3]*150;

    console.log("clientX: " + x + " - clientY: " + y);
    document.getElementById("info").innerText = "";
    checkAreas(x, y, "0");
    checkAreas(x, y, "1");
    checkAreas(x, y, "2");
}
function checkAreas(x, y, areaClass){
    let areaKeys = Object.keys(mapCode[areaClass]);
    for(let i=1; i<areaKeys.length; i++){
        let area = mapCode[areaClass][areaKeys[i]];
        let coords = area["coords"];
        let sections = area["sections"];
        let sectionDims = area["sectionDims"];
        let orientation = area["orientation"];
        let inBounds = false;
        if(x > coords[0] && x < coords[0]+sectionDims[0] && y > coords[1] && y < coords[1]+sectionDims[1]*sections && orientation === "y")
            inBounds = true;
        else if (x > coords[0] && x < coords[0]+sectionDims[0]*sections && y > coords[1] && y < coords[1]+sectionDims[1] && orientation === "x")
            inBounds = true;
        for(let j=0; j<sections && inBounds; j++){
            let shelfX = orientation === "y" ? coords[0] : coords[0]+(j*sectionDims[0]);
            let shelfY = orientation === "y" ? coords[1]+(j*sectionDims[1]) : coords[1];
            if(x > shelfX && x < shelfX+sectionDims[0] && y > shelfY && y < shelfY+sectionDims[1]){
                if(area["type"] === "entrance"){
                    document.getElementById("info").innerText = "Entrance";
                    continue;
                }
                if(area["type"] === "exit"){
                    document.getElementById("info").innerText = "Exit";
                    continue;
                }
                let shelfItems = [];
                let inShoppingList = [];
                document.getElementById("info").innerText = areaClass === "0" ? "Isle "+(i)+", Shelf "+(j+1) : "Register "+(i+1);
                for(let k=0; k<foodCode.length && areaClass === "0"; k++)
                    if(foodCode[k]["asiles"] === i && foodCode[k]["shelf"] === j) {
                        shelfItems.push(foodCode[k]["product"]);
                        for(let k2=0; k2<cardList.length; k2++)
                            if(cardList[k2][0].id === foodCode[k]["product"]+"Card")
                                inShoppingList.push(foodCode[k]["product"]);
                    }
                if(shelfItems.length !== 0)
                    document.getElementById("info").innerText += "\nItems in shelf: " + shelfItems.toString();
                else if (areaClass === "0")
                    document.getElementById("info").innerText += "\nItems in shelf: Unknown";
                else
                    document.getElementById("info").innerText += "\n"+(area["type"] === "checkout" ? "Checkout" : "Express");
                if(inShoppingList.length !== 0)
                    document.getElementById("info").innerText += "\nItems in list: " + inShoppingList.toString();
            }
        }
    }
}

function drawPath(orderedList){
    refreshMap();
    ctx.beginPath();
    ctx.moveTo(mapCode[2]["door1"]["coords"][0], mapCode[2]["door1"]["coords"][1]);
    let isle = mapCode["0"]["isle" + foodCode[orderedList[0][5]]["asiles"]];
    if (isle["orientation"] === "y")
        ctx.lineTo(orderedList[0][1] + isle["sectionDims"][0] / 2, orderedList[0][2] + ((foodCode[orderedList[0][5]]["shelf"] + .5) * isle["sectionDims"][1]));
    else
        ctx.lineTo(orderedList[0][1] + ((foodCode[orderedList[0][5]]["shelf"] + .5) * isle["sectionDims"][0]), orderedList[0][2] + isle["sectionDims"][1] / 2);
    ctx.stroke();
    for(let i=0; i<orderedList.length-1; i++){
        console.log("Marking (1) , at x "+orderedList[i][1]+", y "+orderedList[i][2])
        console.log("Marking (2) , at x2 "+orderedList[i+1][1]+", y2 "+orderedList[i+1][2])
        ctx.beginPath();
        isle = mapCode["0"]["isle" + foodCode[orderedList[i][5]]["asiles"]];
        if (isle["orientation"] === "y")
            ctx.moveTo(orderedList[i][1] + isle["sectionDims"][0] / 2, orderedList[i][2] + ((foodCode[orderedList[i][5]]["shelf"] + .5) * isle["sectionDims"][1]));
        else
            ctx.moveTo(orderedList[i][1] + ((foodCode[orderedList[i][5]]["shelf"] + .5) * isle["sectionDims"][0]), orderedList[i][2] + isle["sectionDims"][1] / 2);

        isle = mapCode["0"]["isle" + foodCode[orderedList[i+1][5]]["asiles"]];
        if (isle["orientation"] === "y")
            ctx.lineTo(orderedList[i+1][1] + isle["sectionDims"][0] / 2, orderedList[i+1][2] + ((foodCode[orderedList[i+1][5]]["shelf"] + .5) * isle["sectionDims"][1]));
        else
            ctx.lineTo(orderedList[i+1][1] + ((foodCode[orderedList[i+1][5]]["shelf"] + .5) * isle["sectionDims"][0]), orderedList[i+1][2] + isle["sectionDims"][1] / 2);
        //ctx.moveTo(orderedList[i][1], orderedList[i][2]);
        //ctx.lineTo(orderedList[i+1][1], orderedList[i+1][2]);
        ctx.stroke();
    }
    ctx.beginPath();
    isle = mapCode["0"]["isle" + foodCode[orderedList[orderedList.length-1][5]]["asiles"]];
    if (isle["orientation"] === "y")
        ctx.moveTo(orderedList[orderedList.length-1][1] + isle["sectionDims"][orderedList.length-1] / 2, orderedList[orderedList.length-1][2] + ((foodCode[orderedList[orderedList.length-1][5]]["shelf"] + .5) * isle["sectionDims"][1]));
    else
        ctx.moveTo(orderedList[orderedList.length-1][1] + ((foodCode[orderedList[orderedList.length-1][5]]["shelf"] + .5) * isle["sectionDims"][orderedList.length-1]), orderedList[orderedList.length-1][2] + isle["sectionDims"][1] / 2);

    if(orderedList.length > 10) {
        ctx.lineTo(mapCode[1]["register1"]["coords"][0], mapCode[1]["register1"]["coords"][1]);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mapCode[1]["register1"]["coords"][0], mapCode[1]["register1"]["coords"][1]);
    }
    else {
        ctx.lineTo(mapCode[1]["register6"]["coords"][0], mapCode[1]["register6"]["coords"][1]);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mapCode[1]["register6"]["coords"][0], mapCode[1]["register6"]["coords"][1]);
    }
    ctx.lineTo(mapCode[2]["door2"]["coords"][0], mapCode[2]["door2"]["coords"][1]);
    ctx.stroke();
}