//An array containing the HTML elements that make up the item list
let cardList = [];
//Returns the details associated with a particular item based on its name
function itemDetails(item){
	for (let index = 0; index < foodCode.length; ++index) {
		if(foodCode[index]["product"].toLowerCase() === item.toLowerCase()) {
			markCoords(foodCode[index]["asiles"], foodCode[index]["shelf"])
			return [foodCode[index]["product"], foodCode[index]["asiles"], foodCode[index]["shelf"], foodCode[index]["class"]];
		}
	}
	return [item, -1, -1, "unknown"]
}
//Format information about an item in a human-friendly way
function parseDetails(item){
	let details = itemDetails(item);
	return "Isle: " + (details[1]+1) + ", Shelf: " + (details[2]+1) + ", Type: " + details[3];
}
//Reorganize the cardList based on the given method
function reSort(method){
	document.getElementById("itemList").innerHTML = "";
	document.getElementById("item").disabled = method === "drag";
	//Sort array
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
		//Reorders the cards based on the order they will be picked up in
		plotPath(true);

	//Updates the HTML elements to reflect the new order of cardList
	for (let index = 0; index < cardList.length; ++index) {
		document.getElementById("itemList").appendChild(cardList[index][0]);
		//Enables or disables dragging
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
//Updates the HTML elements to reflect the new order of cardList
function refreshDragOrder(){
	let listList = document.getElementById("itemList").children;
	for (let i = 0; i < cardList.length; ++i) {
		for (let j = 0; j < listList.length; ++j) {
			if(listList[j].id === cardList[i][0].id)
				cardList[i][1] = j;
		}
	}
}

//Ads a new item to cardLisr
function addItem(product, updateAllLists){
	//Creates HTML element
	const li = document.createElement("LI");
	if(product === "") return;
	li.id = product+"Card";
	li.className = "w3-display-container"
	li.innerHTML = "<span onclick=\"" +
		"					 /*Set item to being checked off*/" +
		"					 this.parentElement.children[2].src='img/check.png';\n" +
		"                    this.parentElement.children[0].style.display='none';\n" +
		"                    this.parentElement.children[1].style.display='inline';\"\n" +
		"                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&check;</b></span>\n" +
		"           <div class=\"w3-bar w3-display-right w3-quarter\" style=\"display: none\">\n" +
		"                <span onclick=\"" +
		"					 /*Sets item to being visible*/" +
		"					 this.parentElement.parentElement.children[2].src='img/question.png';\n" +
		"                    this.parentElement.style.display='none';\n" +
		"                    this.parentElement.parentElement.children[0].style.display='inline';\"\n" +
		"                      class=\"w3-button\" ><b>&times;</b></span>\n" +
		"				 <span onclick=\"" +
		"					   /*Removes item*/" +
		"					   removeCard('"+product+"');\"\n" +
		"                      class=\"w3-button\"><b>&midcir;</b></span>\n" +
		"           </div>\n" +
		"           <img src=\"img/question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\">\n" +
		"           <div class=\"w3-bar-item\">\n" +
		"               <span class=\"w3-large\">"+product+"</span><br>\n" +
		"               <span id='"+product+"CardData'>"+parseDetails(product)+"</span>\n" +
		"           </div>";
	addDnDHandlers(li);
	//Add new element to array
	cardList.push([li, document.getElementById("itemList").childElementCount]);
	//Refresh ALL_LISTS
	if(ALL_LISTS[EDITING_LIST] !== undefined && updateAllLists)
		ALL_LISTS[EDITING_LIST][3].push(product);
	window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
	document.getElementById("itemList").appendChild(li);

	//Refresh ordering
	reSort(document.getElementById("sortSelect").value);
}
//Removes a card from the screen and form the list
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

//Calculates path that a user would pick up the items in
function plotPath(mutateCards){
	//Array of items and their physical coordiantes
	let coordItems = [];
	//Array of items that are unknown to the database
	let unknownItems = [];
	//Add items to appropriate lists
	for(let i=0; i<cardList.length; i++){
		let itemName = cardList[i][0].id.substring(0, cardList[i][0].id.lastIndexOf("Card"));
		let info = getProductInfo(itemName);
		if(info !== undefined)
			coordItems.push([itemName, info[0], info[1], info[2], i, info[3]]);
		else
			unknownItems.push(cardList[i]);
	}
	//Ordered list of items
	let orderedItems = [];
	//Ordered list of HTML elements
	let orderedCards = [];
	let minDist = Infinity;
	let minDistIndex = -1;
	let lastPoint = ["", mapCode[2]["door1"]["coords"][0], mapCode[2]["door1"]["coords"][1], ""];
	let minDistPoint = [];
	//Calculate hte minimum distance from each point to the next closest point
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
	//Update cardList
	if(mutateCards) cardList = orderedCards;
	//Add unknown items
	for(let i=0; i<unknownItems.length; i++)
		cardList.push(unknownItems[i]);
	return orderedItems;
}

//Pythagorean theorem
function dist(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

