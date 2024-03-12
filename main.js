if(localStorage.getItem("NodeLists")){
	var mainStorage = JSON.parse(localStorage.getItem("NodeLists"))
}else{
	var mainStorage = []
}

let currentNodeListID = ""

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}




const element = document.getElementById("dragItem");
const NodeList = document.querySelector(".Nodeslist")

let offsetX = document.querySelector(".leftNav").offsetWidth;

let clientx, clienty;

let lastX, lastY;

let interval;

const listLchangeN = (e, el) =>{
	document.querySelector(".bgText").innerText = el.innerText
	for(let j = 0; j < mainStorage.length; j++){
		if(mainStorage[j].id == el.parentElement.classList[1]){
			mainStorage[j].title = el.innerText;
		}
	}
	storeDatatoLocal()
}

const appendLISTANDNODES=()=>{
	for(let i = 0; i < mainStorage.length; i++){
		createNodeList(false, mainStorage[i].id, mainStorage[i].title)
	}
	ff = document.querySelectorAll(".item")[0]
	if(ff) initiateMindMap(0, document.querySelectorAll(".item")[0])


}


const getRandomID = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const nodeListList = document.querySelector(".navItems")


const storeDatatoLocal = ()=>{
	localStorage.setItem("NodeLists", JSON.stringify(mainStorage))
}

const createNodeList = (notun, id, title)=>{
	active = "nada"
	if(notun){
		id = getRandomID(5)
		title = "Untitled"
		active = "activeItem"

		NodeList.innerHTML = ""
		listDict = {
			"title": title,
			"id": id,
			"nodeListX": 0,
			"nodeListY": 0,
			"Nodes": []
		}

		mainStorage.push(listDict)
		storeDatatoLocal()

		if(currentNodeListID!==""){
			document.querySelector("."+currentNodeListID).classList.remove("activeItem")
		}
		
		currentNodeListID = id

		document.querySelector(".bgText").innerText = title
		// el.focus()
	}
	
	const el = document.createElement("div")
	el.classList.add("item", id, active)
	el.setAttribute("onclick", "initiateMindMap(event, this)")
	
	const itemEl = document.createElement("div")
	itemEl.classList.add("itemText")
	itemEl.setAttribute("contenteditable", "true")
	itemEl.setAttribute("oninput", "listLchangeN(event, this)")
	itemEl.innerText = title

	const delbutt = document.createElement("div")
	delbutt.innerText = "X"
	delbutt.classList.add("delButt")
	delbutt.setAttribute("onclick", "deleteNodesList(this)")

	el.append(itemEl)
	el.append(delbutt)

	NodeList.innerHTML = ""

	nodeListList.append(el)
	checkifEmpty()


	if(notun){
		itemEl.focus()
		placeCaretAtEnd(itemEl)
	} 
	
}

const deleteNodesList = (el)=>{
	for(let u = 0; u < mainStorage.length; u++){
		if(mainStorage[u].id==el.parentElement.classList[1]){
			mainStorage.splice(u, 1)
		}
	}
	storeDatatoLocal()
	el.parentElement.remove()
	document.querySelector(".bgText").innerText = "deleted......"
	
	checkifEmpty()

}

nodeListList.addEventListener("contextmenu", (e)=>{
	e.preventDefault()
	if(!e.srcElement.classList.contains("item")){
		createNodeList(true, "", "")
	}
})


document.addEventListener("keydown", (e)=>{
	if(e.code=="Space" && document.activeElement == document.body && currentNodeListID!==""){
			createNode(true, 1,2,3,4,5)
	}
})



const initiateMindMap = (e, el) =>{

	if(e!==0){
		if(e.target.classList.contains("delButt")) return
	}

	if(currentNodeListID!==""){
		document.querySelector("."+currentNodeListID).classList.remove("activeItem")
	}
	el.classList.add("activeItem")
	NodeList.innerHTML = ""
	currentNodeListID = el.classList[1]
	document.querySelector(".bgText").innerText = el.querySelector(".itemText").innerText

	for(let k=0; k< mainStorage.length; k++){
		if(mainStorage[k].id == currentNodeListID){
			NodeList.style.top = mainStorage[k].nodeListY + "px"
			NodeList.style.left = mainStorage[k].nodeListX + "px"
			for(j=0; j< mainStorage[k].Nodes.length;j++){

				el = mainStorage[k].Nodes[j]

				createNode(false, el.node, el.id, el.color, el.posX, el.posY)
			}
		}
	}
}



document.addEventListener("mousemove", (e)=>{
	clientx = e.clientX;
	clienty = e.clientY;
}, {passive: true, capture: true})
document.body.onresize = function(){
	offsetX = document.querySelector(".leftNav").offsetWidth;
}


function deleteNode(id,el){
	for(let j=0; j < mainStorage.length; j++){
		if(mainStorage[j].id == currentNodeListID){
			for(let f = 0; f< mainStorage[j].Nodes.length; f++){
				if(mainStorage[j].Nodes[f].id == id){
					mainStorage[j].Nodes.splice(f, 1)
				}
			}
		}
	}
	el.remove()
	storeDatatoLocal()
}

const mainMap = document.querySelector(".mainMap")

mainMap.addEventListener("contextmenu", (e)=>{
	e.preventDefault()
	if(!e.srcElement.classList.contains("Node")){
		if(currentNodeListID!=="")
			createNode(true, 1,2,3,4,5)
	}else{
		deleteNode(e.target.classList[2], e.target)
	}
})


let nodeLLastX
let nodeLLastY

function saveNodePos(){
	for(let i=0; i< mainStorage.length; i++){
		if(mainStorage[i].id == currentNodeListID){
			mainStorage[i].nodeListX = nodeLLastX
			mainStorage[i].nodeListY = nodeLLastY
		}
	}
	storeDatatoLocal()
}

mainMap.addEventListener("mousedown", e=>{
	if(e.button==1){
		  let shiftX = e.clientX - NodeList.getBoundingClientRect().left;
		  let shiftY = e.clientY - NodeList.getBoundingClientRect().top;

		  NodeList.style.position = 'absolute';

		  moveAt(e.pageX, e.pageY);

		  function moveAt(pageX, pageY) {
		  	nodeLLastX = pageX - shiftX
		    nodeLLastY = pageY - shiftY
		    saveNodePos()
		    NodeList.style.left = nodeLLastX + "px";
		    NodeList.style.top = nodeLLastY + "px";

		    mainMap.style.backgroundPosition = nodeLLastX + "px"+ " " + nodeLLastY + "px"
		  }

		  function onMouseMove(event) {
		    moveAt(event.pageX, event.pageY);
		  }

		  document.addEventListener('mousemove', onMouseMove);

		  mainMap.onmouseup = function() {
		    document.removeEventListener('mousemove', onMouseMove);
		    NodeList.onmouseup = null;
		  };
	}

})

// let inScale = 1;

// mainMap.addEventListener("wheel", e=>{
// 	console.log(e)
// 	if(e.deltaY == 100){
// 		scale = inScale - 0.05
// 	}else{
// 		scale = inScale + 0.05
// 	}
// 	NodeList.style.transform = "scale("+scale+")"
// 	inScale = scale
// })

function nodeDown(e, el){
	if(e.button==0){
		  let shiftX = e.clientX - el.getBoundingClientRect().left;
		  let shiftY = e.clientY - el.getBoundingClientRect().top;

		  el.style.position = 'absolute';

		  moveAt(e.pageX, e.pageY);

		  function moveAt(pageX, pageY) {
		  	nodeLLastX = pageX - shiftX - window.getComputedStyle(NodeList).left.replace("px", "") + 'px'
		    nodeLLastY = pageY - shiftY - window.getComputedStyle(NodeList).top.replace("px", "") + 'px'

		    el.style.left = nodeLLastX;
		    el.style.top = nodeLLastY;
		    NodenameC(el)

		  }

		  function onMouseMove(event) {
		    moveAt(event.pageX, event.pageY);
		  }

		  document.addEventListener('mousemove', onMouseMove);

		  el.onmouseup = function() {
		  	console.log('fdsa')
		    document.removeEventListener('mousemove', onMouseMove);
		    NodeList.onmouseup = null;
		  };
	}
}

const saveAppendNodes = (id, text, posX, posY, colorClass)=>{
	nodeDict = {
		"node": text,
		"id": id,
		"color": colorClass,
		"posX": posX,
		"posY": posY
	}

	for(let o=0; o< mainStorage.length; o++){
		if(mainStorage[o].id==currentNodeListID){
			mainStorage[o].Nodes.push(nodeDict);
		}
	}

	storeDatatoLocal()
}

const checkifEmpty=()=>{
	label = document.querySelector(".emptyorno")
	count = nodeListList.childElementCount
	if(count == 1){
		label.style.display = "block"
	}else{
		label.style.display = "none"
	}
	
}
checkifEmpty()
const NodenameC = (el, e)=>{
	console.log(e)
	for(let y = 0; y< mainStorage.length; y++){
		if(mainStorage[y].id == currentNodeListID){
			for(let i = 0; i< mainStorage[y].Nodes.length; i++){
				if(mainStorage[y].Nodes[i].id == el.classList[2]){
					elr = mainStorage[y].Nodes[i]
					elr.node = el.innerText;
					elr.posX = window.getComputedStyle(el).left.replace("px", "")
					elr.posY = window.getComputedStyle(el).top.replace("px", "")
					mainStorage[y].Nodes[i] = elr
				}
			}
		}
	}
	storeDatatoLocal()
}

const createNode = (notun, text, id, color, posx, posy)=>{
	colorArr = ["nodeR", "nodeG", "nodeB", "nodeP", "nodeS", "nodeBG", "nodeO"]

	if(notun){
		id = getRandomID(4)
		color = colorArr[Math.floor(Math.random()*colorArr.length)]
		text = "-"
		posx = clientx -window.getComputedStyle(NodeList).left.replace("px", "")
		posy = clienty - window.getComputedStyle(NodeList).top.replace("px", "")
		console.log(posx, clientx)
		saveAppendNodes(id, "--", posx, posy, color)
	}


	const mainEl = document.createElement('div')
	mainEl.classList.add("Node", color, id)
	mainEl.innerText = text
	mainEl.setAttribute("contenteditable",  "true")
	mainEl.setAttribute("onmousedown",  "nodeDown(event, this)")
	mainEl.setAttribute("oninput",  "NodenameC(this, event)")

	// mainEl.setAttribute("oninput",  "NodenameC(this)")
	try{
		mainEl.style.top  = posy  + "px";
		mainEl.style.left  = posx + "px";
	}
	catch(err){
		
	}
	NodeList.append(mainEl)


	if(notun) {
		mainEl.focus()
		placeCaretAtEnd(mainEl)
	}
}

let dragging = false;
let stop = false

appendLISTANDNODES()
