let c;
let ctx;
let areaTypes = {"grocery": "#30A030", "produce": "#00F060", "seafood": "#0060B0", "meat": "#A04040",
    "diary": "#9060B0", "checkout": "#776777", "expressCheckout": "#A5A500", "entrance": "#00FF00",
    "exit": "#FF0000"};
//item, isle, shelf, class
let foodCode = [["pepper", 0, 0, "spices"], ["salt", 0, 0, "spices"], ["crackers", 0, 1, "grain"], ["oats", 0, 1, "grain"],
    ["walnuts", 1, 2, "nuts"], ["peanuts", 1, 2, "nuts"], ["milk", 7, 0, "dairy"], ["yogurt", 7, 1, "dairy"]];
let mapCode;
function initMap(){
    c = document.getElementById("mapCanvas");
    c.addEventListener("click", mapClick);
    ctx = c.getContext("2d");
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
function markCoords(isleNum, shelfNum){
    isleNum++;
    if(Object.keys(mapCode["0"]).indexOf("isle"+isleNum) !== -1) {
        let isle = mapCode["0"]["isle" + isleNum];
        if (isle["sections"] > shelfNum) {
            let coords = isle["coords"];
            ctx.fillStyle = "red";
            ctx.beginPath();
            if (isle["orientation"] === "y")
                ctx.arc(coords[0]+isle["sectionDims"][0]/2, coords[1]+((shelfNum+.5)*isle["sectionDims"][1]), 2, 0, 2 * Math.PI);
            else
                ctx.arc(coords[0]+((shelfNum+.5)*isle["sectionDims"][0]), coords[1]+isle["sectionDims"][1]/2, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}
function mapClick(event) {
    let coords = [c.getBoundingClientRect().left, c.getBoundingClientRect().top, c.getBoundingClientRect().width, c.getBoundingClientRect().height]
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
                document.getElementById("info").innerText = areaClass === "0" ? "Isle "+(i+1)+", Shelf "+(j+1) : "Register "+(i+1);
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
