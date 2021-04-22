const cardList = [];
function itemDetails(item){
	for (let index = 0; index < foodCode.length; ++index) {
		if(foodCode[index]["\"product\""] === item.toLowerCase()) {
			markCoords(foodCode[index]["asiles"], foodCode[index]["shelf"])
			return [foodCode[index]["\"product\""], foodCode[index]["asiles"], foodCode[index]["shelf"], foodCode[index]["class"]];
		}
	}
	return [item, -1, -1, "unknown"]
}

function parseDetails(item){
	let details = itemDetails(item);
	return "Isle: " + details[1] + ", Shelf: " + details[2] + ", Type: " + details[3];
}

function reSort(method){
	document.getElementById("itemList").innerHTML = "";
	if(method === "drag")
		document.getElementById("item").disabled = true;
	else
		document.getElementById("item").disabled = false;
	cardList.sort(function(a, b) {
		if (method === "name") {
			let first = a[0].id.toLowerCase();
			let second = b[0].id.toLowerCase();
			if (first > second) return 1;
			if (first < second) return -1;
		}
		if (method === "category") {
			let first = itemDetails(a[0].id.substring(0, a[0].id.length-4)[3]);
			let second = itemDetails(b[0].id.substring(0, b[0].id.length-4)[3]);
			if (first > second) return 1;
			if (first < second) return -1;
		}
		if(method === "drag"){
			let first = a[1];
			let second = b[1];
			if (first > second) return 1;
			if (first < second) return -1;
		}
		return 0;
	});

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

function addItem(input){
	const li = document.createElement("LI");
	if(input.value === "") return;
	li.id = input.value+"Card";
	li.className = "w3-display-container"
	li.innerHTML = "<span onclick=\"this.parentElement.children[2].src='check.png';\n" +
		"                    this.parentElement.children[0].style.display='none';\n" +
		"                    this.parentElement.children[1].style.display='inline';\"\n" +
		"                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&check;</b></span>\n" +
		"           <div class=\"w3-bar w3-display-right w3-quarter\" style=\"display: none\">\n" +
		"                <span onclick=\"this.parentElement.parentElement.children[2].src='question.png';\n" +
		"                    this.parentElement.style.display='none';\n" +
		"                    this.parentElement.parentElement.children[0].style.display='inline';\"\n" +
		"                      class=\"w3-button\" ><b>&times;</b></span>\n" +
		"				 <span onclick=\"removeCard('"+input.value+"');\"\n" +
		"                      class=\"w3-button\"><b>&midcir;</b></span>\n" +
		"           </div>\n" +
		"           <img src=\"../question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\">\n" +
		"           <div class=\"w3-bar-item\">\n" +
		"               <span class=\"w3-large\">"+input.value+"</span><br>\n" +
		"               <span id='"+input.value+"CardData'>"+parseDetails(input.value)+"</span>\n" +
		"           </div>";
	addDnDHandlers(li);
	cardList.push([li, document.getElementById("itemList").childElementCount]);
	if(ALL_LISTS[EDITING_LIST] !== undefined)
		ALL_LISTS[EDITING_LIST][3].push(input.value);
	window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
	input.value = "";
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
