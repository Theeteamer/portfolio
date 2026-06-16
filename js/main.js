window.addEventListener("scroll",()=>{

document.querySelectorAll(".card").forEach(card=>{

let position = card.getBoundingClientRect().top;

if(position < window.innerHeight-100){

card.classList.add("show");

}

});

});