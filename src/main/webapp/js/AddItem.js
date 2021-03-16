function addItem(){
    const li = document.createElement("LI");
    const input = document.getElementById("item");
    if(input.value === "") return;
    li.className = "w3-display-container"
    li.innerHTML = "<span onclick=\"this.parentElement.children[2].src='img/check.png';\n" +
        "                    this.parentElement.children[0].style.display='none';\n" +
        "                    this.parentElement.children[1].style.display='inline';\n" +
        "                    addAction('Set Completed Flag On "+input.value+"');\"\n" +
        "                      class=\"w3-button w3-display-right\" style=\"display: inline\"><b>&check;</b></span>\n" +
        "                <span onclick=\"this.parentElement.children[2].src='img/question.png';\n" +
        "                    this.parentElement.children[1].style.display='none';\n" +
        "                    this.parentElement.children[0].style.display='inline'\n" +
        "                    addAction('Remove Completed Flag From "+input.value+"');\"\n" +
        "                      class=\"w3-button w3-display-right\" style=\"display: none\"><b>&times;</b></span>\n" +
        "                <img src=\"img/question.png\" class=\"w3-bar-item w3-circle\" style=\"width:85px\">\n" +
        "                <div class=\"w3-bar-item\">\n" +
        "                    <span class=\"w3-large\">"+input.value+"</span><br>\n" +
        "                    <span>[Fetch Shelf and Isle data]</span>\n" +
        "                </div>";
    input.value = "";

    document.getElementById("itemList").appendChild(li);
}
function addAction(action){
    const li = document.createElement("LI");
    li.className = "w3-display-container"
    li.innerHTML = "<p>PHP:> "+action+"</p>";

    document.getElementById("actionList").appendChild(li);
}
