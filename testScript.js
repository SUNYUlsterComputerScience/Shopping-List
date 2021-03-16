const cardList = [];
//item, isle, shelf, class
const itemList = [["milk", 0, 0, "dairy"], ["apple", 1, 5, "fruit"]];
function itemDetails(item){
	for (let index = 0; index < itemList.length; ++index) {
		if(itemList[index][0] === item.toLowerCase())
			return itemList[index];
	}
	return [item, -1, -1, "unknown"]
}

function parseDetails(item){
	let details = itemDetails(item);
	return "Isle: " + details[1] + ", Shelf: " + details[2] + ", Type: " + details[3];
}

function reSort(method){
	document.getElementById("itemList").innerHTML = "";
	cardList.sort(function(a, b) {
		if (method === "name") {
			let first = a.id.toLowerCase();
			let second = b.id.toLowerCase();
			if (first > second) return 1;
			if (first < second) return -1;
		}
		if (method === "category") {
			let first = itemDetails(a.id.substring(0, a.id.length-4)[3]);
			let second = itemDetails(b.id.substring(0, b.id.length-4)[3]);
			if (first > second) return 1;
			if (first < second) return -1;
		}
		return 0;
	});

	for (let index = 0; index < cardList.length; ++index) {
		document.getElementById("itemList").appendChild(cardList[index]);
	}
}

function addItem(input){
	const li = document.createElement("LI");
	if(input.value === "") return;
	li.id = input.value+"Card";
	li.className = "w3-display-container"
	li.innerHTML = "<span onclick=\"this.parentElement.children[2].src='check.png';\n" +
		"                    this.parentElement.children[0].style.display='none';\n" +
		"                    this.parentElement.children[1].style.display='inline';\n" +
		"                    addAction('Set Completed Flag On "+input.value+"');\"\n" +
		"                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&check;</b></span>\n" +
		"           <div class=\"w3-bar w3-display-right w3-quarter\" style=\"display: none\">\n" +
		"                <span onclick=\"this.parentElement.parentElement.children[2].src='question.png';\n" +
		"                    this.parentElement.style.display='none';\n" +
		"                    this.parentElement.parentElement.children[0].style.display='inline';\n" +
		"                    addAction('Remove Completed Flag From "+input.value+"');\"\n" +
		"                      class=\"w3-button\" ><b>&times;</b></span>\n" +
		"				 <span onclick=\"removeCard('"+input.value+"');\"\n" +
		"                      class=\"w3-button\"><b>&midcir;</b></span>\n" +
		"           </div>\n" +
		"           <img src=\"question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\">\n" +
		"           <div class=\"w3-bar-item\">\n" +
		"               <span class=\"w3-large\">"+input.value+"</span><br>\n" +
		"               <span id='"+input.value+"CardData'>"+parseDetails(input.value)+"</span>\n" +
		"           </div>";
	cardList.push(li)
	input.value = "";
	document.getElementById("itemList").appendChild(li);
}
function removeCard(card){
	document.getElementById("itemList").innerHTML = "";
	for (let index = 0; index < cardList.length; ++index) {
		if(cardList[index].id === card.toLowerCase()+"Card") {
			cardList.splice(index, 1);
			--index;
		}
		else
			document.getElementById("itemList").appendChild(cardList[index]);
	}
}
function addAction(action){
	const li = document.createElement("LI");
	li.className = "w3-display-container"
	li.innerHTML = "<p>PHP:> "+action+"</p>";

	document.getElementById("actionList").appendChild(li);
}

