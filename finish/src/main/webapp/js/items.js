let cardList = [];
function itemDetails(item){
	for (let index = 0; index < foodCode.length; ++index) {
		if(foodCode[index]["product"].toLowerCase() === item.toLowerCase()) {
			markCoords(foodCode[index]["asiles"], foodCode[index]["shelf"])
			return [foodCode[index]["product"], foodCode[index]["asiles"], foodCode[index]["shelf"], foodCode[index]["class"]];
		}
	}
	return [item, -1, -1, "unknown"]
}

function parseDetails(item){
	let details = itemDetails(item);
	return "Isle: " + (details[1]+1) + ", Shelf: " + (details[2]+1) + ", Type: " + details[3];
}

function reSort(method){
	document.getElementById("itemList").innerHTML = "";
	document.getElementById("item").disabled = method === "drag";
	if(method !== "pickup") {
		cardList.sort(function (a, b) {
			if (method === "name") {
				let first = a[0].id.toLowerCase();
				let second = b[0].id.toLowerCase();
				if (first > second) return 1;
				if (first < second) return -1;
			}
			if (method === "category") {
				let first = itemDetails(a[0].id.substring(0, a[0].id.length - 4)[3]);
				let second = itemDetails(b[0].id.substring(0, b[0].id.length - 4)[3]);
				if (first > second) return 1;
				if (first < second) return -1;
			}
			if (method === "drag") {
				let first = a[1];
				let second = b[1];
				if (first > second) return 1;
				if (first < second) return -1;
			}
			return 0;
		});
	}else
		plotPath(true);


	for (let index = 0; index < cardList.length; ++index) {
		document.getElementById("itemList").appendChild(cardList[index][0]);
		if(method === "drag"){
			cardList[index][0].setAttribute('draggable', "true");
			cardList[index][0].style.cursor="move";
		}
		else{
			cardList[index][0].setAttribute('draggable', "false");
			cardList[index][0].style.cursor="auto";
		}
		cardList[index][0].classList.remove('dragElem');
	}
}

function refreshDragOrder(){
	let listList = document.getElementById("itemList").children;
	for (let i = 0; i < cardList.length; ++i) {
		for (let j = 0; j < listList.length; ++j) {
			if(listList[j].id === cardList[i][0].id)
				cardList[i][1] = j;
		}
	}
}

function addItem(product, updateAllLists){
	const li = document.createElement("LI");
	if(product === "") return;
	li.id = product+"Card";
	li.className = "w3-display-container"
	li.innerHTML = "<span onclick=\"this.parentElement.children[2].src='img/check.png';\n" +
		"                    this.parentElement.children[0].style.display='none';\n" +
		"                    this.parentElement.children[1].style.display='inline';\"\n" +
		"                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&check;</b></span>\n" +
		"           <div class=\"w3-bar w3-display-right w3-quarter\" style=\"display: none\">\n" +
		"                <span onclick=\"this.parentElement.parentElement.children[2].src='img/question.png';\n" +
		"                    this.parentElement.style.display='none';\n" +
		"                    this.parentElement.parentElement.children[0].style.display='inline';\"\n" +
		"                      class=\"w3-button\" ><b>&times;</b></span>\n" +
		"				 <span onclick=\"removeCard('"+product+"');\"\n" +
		"                      class=\"w3-button\"><b>&midcir;</b></span>\n" +
		"           </div>\n" +
		"           <img src=\"img/question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\">\n" +
		"           <div class=\"w3-bar-item\">\n" +
		"               <span class=\"w3-large\">"+product+"</span><br>\n" +
		"               <span id='"+product+"CardData'>"+parseDetails(product)+"</span>\n" +
		"           </div>";
	addDnDHandlers(li);
	cardList.push([li, document.getElementById("itemList").childElementCount]);
	if(ALL_LISTS[EDITING_LIST] !== undefined && updateAllLists)
		ALL_LISTS[EDITING_LIST][3].push(product);
	window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
	document.getElementById("itemList").appendChild(li);
	reSort(document.getElementById("sortSelect").value);
}
function removeCard(card){
	document.getElementById("itemList").innerHTML = "";
	for (let index = 0; index < cardList.length; ++index) {
		if(cardList[index][0].id === card.toLowerCase()+"Card") {
			cardList.splice(index, 1);
			if(ALL_LISTS[EDITING_LIST] !== undefined)
				ALL_LISTS[EDITING_LIST][3].splice(index, 1);
			window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
			--index;
		}
		else
			document.getElementById("itemList").appendChild(cardList[index][0]);
	}
}
function addAction(action){
	const li = document.createElement("LI");
	li.className = "w3-display-container"
	li.innerHTML = "<p>PHP:> "+action+"</p>";

	document.getElementById("actionList").appendChild(li);
}

function plotPath(mutateCards){
	let coordItems = []
	let unknownItems = []
	for(let i=0; i<cardList.length; i++){
		let itemName = cardList[i][0].id.substring(0, cardList[i][0].id.lastIndexOf("Card"));
		let info = getProductInfo(itemName);
		if(info !== undefined)
			coordItems.push([itemName, info[0], info[1], info[2], i, info[3]]);
		else
			unknownItems.push(cardList[i]);
	}
	let orderedItems = [];
	let orderedCards = []
	let minDist = Infinity;
	let minDistIndex = -1;
	let lastPoint = ["", mapCode[2]["door1"]["coords"][0], mapCode[2]["door1"]["coords"][1], ""];
	let minDistPoint = [];
	for(let i=0; coordItems.length > 0; i++){
		let currentDist = dist(coordItems[i][1], coordItems[i][2], lastPoint[1], lastPoint[2]);
		if(currentDist < minDist){
			minDist = currentDist;
			minDistIndex = i;
			minDistPoint = coordItems[i];
		}
		if(i === coordItems.length-1){
			orderedCards.push(cardList[minDistPoint[4]])
			orderedItems.push(minDistPoint);
			coordItems.splice(minDistIndex, 1)
			lastPoint = minDistPoint;
			minDist = Infinity;
			i = -1;
		}
	}
	if(mutateCards) cardList = orderedCards;
	for(let i=0; i<unknownItems.length; i++)
		cardList.push(unknownItems[i]);
	return orderedItems;
}

function dist(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

