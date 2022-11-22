let keyword="";
let next_page=null;
let loading=true;
let current_page=0;
// get initial data
async function getInitData(){
	loading=true;
	let api ="http://3.234.99.9:3000/api/attractions";
	let url=api+"?page=0";	 	
	const response = await fetch(url)
		.then(function(response){
			return response.json();
		})
		.then(function(data){  
			next_page=data["nextPage"];
			return data["data"];   	
    	}); 		
	processData(response);
	document.querySelector("footer").style.display = "flex";		
} getInitData();

//process data to html
function processData(response){
	for(let i =0;i<response.length;i++){
		const div_attraction_desk=document.createElement("div");
		const div_attraction_img_box=document.createElement("div");
		const img_attraction_img=document.createElement("img");
		const div_details_upper=document.createElement("div");
		const div_info_upper=document.createElement("div");
		const div_details_lower=document.createElement("div");
		const div_info_lower=document.createElement("div");
		const div_mrt=document.createElement("div");
		const div_cat=document.createElement("div");
		let div_attractions_container=document.getElementsByClassName("attractions_container");
		
		div_attraction_desk.className="attraction_desk";
		div_attraction_img_box.className="attraction_img_box";
		img_attraction_img.className="attraction_img";
		div_details_upper.className="details_upper";
		div_info_upper.className="info_upper";
		div_details_lower.className="details_lower";
		div_info_lower.className="info_lower";
		div_mrt.className="mrt";
		div_cat.className="cat";		
		
		console.log(response[i]["category"]);
		console.log(response[i]["name"]);

		img_attraction_img.src=response[i]["images"][0];
		div_info_upper.textContent=response[i]["name"];
		div_mrt.textContent=response[i]["mrt"];
		div_cat.textContent=response[i]["category"];
		
		div_info_lower.appendChild(div_mrt);
		div_info_lower.appendChild(div_cat);
		div_details_lower.appendChild(div_info_lower);
		div_details_upper.appendChild(div_info_upper);
		div_attraction_img_box.appendChild(img_attraction_img);
		div_attraction_desk.appendChild(div_attraction_img_box);
		div_attraction_desk.appendChild(div_details_upper);
		div_attraction_desk.appendChild(div_details_lower);
		div_attractions_container[0].insertBefore(div_attraction_desk, div_attractions_container.lastElementChild);
	}	
  	loading=false;	
}
	
	



//IntersectionObserver
let load_list=[];
async function load_more(){	
	if (!next_page || loading){
		return;
	}
	else if(current_page===next_page){
		return;
	}
	current_page=next_page;	
	let api ="http://3.234.99.9:3000/api/attractions";
	let url="";	
	if(keyword===""){
		url= api+"?page="+String(next_page);
	}
	else{
		url= api+"?page="+String(next_page)+"&keyword="+keyword;
	}	 

	const response = await fetch(url)
		.then(function(response){
			return response.json();
		})
		.then(function(data){  
			next_page=data["nextPage"];
			return data["data"];   	
    	});  
	processData(response);	
}
const options = {
	root: null,
	rootMargin: '10px',
	threshold: 0.5,
};

const observer = new IntersectionObserver(load_more, options);
const target = document.querySelector(".copyright_text");
observer.observe(target);

  



//click search button
const search_btn = document.querySelector(".search_btn");
search_btn.onclick = function query(){ 
    keyword = document.querySelector(".search_bar_text").value;
	//delete exist group
	const groups = document.querySelectorAll(".attraction_desk");
	groups.forEach(function(group){
		group.remove();
	});
	getQueryResult();
}


// search key word
async function getQueryResult(){
	loading=true;
	let api ="http://3.234.99.9:3000/api/attractions";
	let url="";
	if(keyword===""){
		url= api+"?page=0";
	}
	else{
		url= api+"?page=0"+"&keyword="+keyword;
	}
	const attractions_container = document.querySelector(".attractions_container");
	attractions_container.textContent="";
	const response = await fetch(url).then(function(response){                
		return response.json();
	}).then(function(data){
		next_page=data["nextPage"];
		return data["data"];   	
	});         
	
	if (response.length===0){
		attractions_container.textContent="no results!";
		return;
	}
	else{
		processData(response);
		}	
	}
	


//click search bar pop up and other place to close category
document.addEventListener('click', function display_category(e){
	let search_bar_text = document.querySelector(".search_bar");
	if (search_bar_text.contains(e.target)) {
        document.querySelector(".search_category").style.display = "flex";		
    }
});
document.addEventListener('click', function hide_category(e) {
	let search_bar_text = document.querySelector(".search_bar");
    let category_container = document.querySelector(".search_category");
    if (!category_container.contains(e.target) && !search_bar_text.contains(e.target)) {
        category_container.style.display = "none";
    }
});

//category
async function category_panel(){
	let search_bar_text = document.querySelector(".search_bar_text");
	let url="http://3.234.99.9:3000/api/categories";
	let div_search_category=document.querySelector(".search_category");
	//remove already existed
	// let previous_cat_items = document.querySelectorAll(".cat_item");
	// previous_cat_items.forEach(function(previous_cat_item){
	// 	previous_cat_item.remove();
	// });
	
	const response = await fetch(url).then(function(response){                
		return response.json();
	}).then(function(data){
		return data["data"];				
	});       

	response.forEach(function(item){
		const div_cat_item=document.createElement("div");
		div_cat_item.className="cat_item";
		div_cat_item.textContent=item;
		
		div_cat_item.addEventListener("click", function put_in_bar(item){
			search_bar_text.value=item.srcElement.textContent;
			document.querySelector(".search_category").style.display = "none";
		});
		div_search_category.insertBefore(div_cat_item, div_search_category.lastElementChild);
	});	
}category_panel();








//   	let btn_more = document.getElementById('load_more');
//     let current=2;
//     btn_more.onclick =()=>{
//         let layer=[...document.querySelectorAll('.mainbox .layer_box .layer_2')]
//         for(let i=current;i<current+2;i++){
//             layer[i].style.display='flex';
//         }
//         current+=2;
//         if(current>=layer.length){
//             btn_more.style.display='none';
//         }
//     }

// }
// console.log(getData());