const cardList = [];
function reSort(method){
	document.getElementById("shoppingLists").innerHTML = "";
	cardList.sort(function(a, b) {
		if (method === "name") {
			let first = a[0].id.toLowerCase();
			let second = b[0].id.toLowerCase();
			if (first > second) return 1;
			if (first < second) return -1;
		}
		if (method === "items") {
			let first = listFromName(a[0].id.substring(0, a[0].id.lastIndexOf("Card")))[3].length;
			let second = listFromName(b[0].id.substring(0, b[0].id.lastIndexOf("Card")))[3].length;
			if (first < second) return 1;
			if (first > second) return -1;
		}
		if(method === "drag"){
			let first = a[1];
			let second = b[1];
			if (first < second) return 1;
			if (first > second) return -1;
		}
		return 0;
	});

	for (let index = 0; index < cardList.length; ++index) {
		if(listFromName(cardList[index][0].id.substring(0, cardList[index][0].id.lastIndexOf("Card")))[4])
			document.getElementById("shoppingLists").appendChild(cardList[index][0]);
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
	let listList = document.getElementById("shoppingLists").children;
	for (let i = 0; i < cardList.length; ++i) {
		for (let j = 0; j < listList.length; ++j) {
			if(listList[j].id === cardList[i][0].id)
				cardList[i][1] = j;
		}
	}
}

function addList(input, updateALL){
	const li = document.createElement("LI");
	if(input.value === "") return;
	let listId;
	if(updateALL) {
		let tmpList = listFromName(null);
		listId = tmpList[0];
		tmpList[2] = input.value;
		window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
	}
	else
		listId = listFromName(input.value)[0];
	li.id = input.value+"Card";
	li.className = "w3-display-container"
	li.innerHTML = "<span onclick=\"removeCard('"+input.value+"');\"\n" +
		"                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&times;</b></span>\n" +
		"           <img src=\"img/question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\"" +
		"			onclick=\"cardClick("+listId+")\">\n" +
		"           <div class=\"w3-bar-item\">\n" +
		"               <span class=\"w3-large\">"+input.value+"</span><br>\" "+
		"			<span id='"+input.value+"CardData'></span>"+
		"           </div>";
	addDnDHandlers(li);
	cardList.push([li, document.getElementById("shoppingLists").childElementCount]);
	if(listFromName(input.value)[4]) {
		document.getElementById("shoppingLists").appendChild(li);
		fillCardData(input.value);
	}
	input.value = "";
	//const cols = document.querySelectorAll('#itemList .w3-display-container');
	//[].forEach.call(cols, addDnDHandlers);
}
function cardClick(listId){
	EDITING_LIST = listId;
	window.sessionStorage.setItem('EDITING_LIST', EDITING_LIST);
	window.open ('items.html','_self');
}
function fillCardData(name){
	for (let i = 0; i < ALL_LISTS.length; i++) {
		if(ALL_LISTS[i][2] === name)
			document.getElementById(name+"CardData").innerHTML = "Items: "+ALL_LISTS[i][3]+"\"";
	}
}
function removeCard(card){
	document.getElementById("shoppingLists").innerHTML = "";
	for (let index = 0; index < cardList.length; ++index) {
		if(cardList[index][0].id === card.toLowerCase()+"Card") {
			cardList.splice(index, 1);
			removeListById(index);
			--index;
		}
		else
			document.getElementById("shoppingLists").appendChild(cardList[index][0]);
	}
}

