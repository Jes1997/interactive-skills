const items = ["HTML","CSS","Tailwind","JavaScript","Vue.js","PHP","Laravel","MySQL","REST APIs","Composer"];
const slots = [document.getElementById("slot1"), document.getElementById("slot2"), document.getElementById("slot3")];
const spinBtn = document.getElementById("spinBtn");
const spinSound = document.getElementById("spinSound");
const stopSound = document.getElementById("stopSound");
const dingSound = document.getElementById("dingSound");
const message = document.getElementById("message");

const itemHeight = 80;
let animations = [null,null,null];
let spinning = [false,false,false];
let results = [0,0,0];

// Rellenar los slots con los items repetidos para efecto loop
function fillSlots() {
  slots.forEach(slot=>{
    slot.innerHTML="";
    for(let i=0;i<20;i++){
      items.forEach(text=>{
        const span = document.createElement("span");
        span.textContent = text;
        slot.appendChild(span);
      });
    }
  });
}
fillSlots();

// Función para iniciar el giro de un rodillo
function startSpin(slotIndex){
  const slot = slots[slotIndex];
  let pos=0;
  spinning[slotIndex]=true;
  slot.classList.add("spinning");

  function animate(){
    if(!spinning[slotIndex]) return;
    const speed = 60 + Math.random()*20; // velocidad variable
    pos -= speed;
    if(pos <= -(slot.scrollHeight/2)) pos=0;
    slot.style.transform=`translateY(${pos}px)`;
    animations[slotIndex] = requestAnimationFrame(animate);
  }
  animate();
}

// Función para parar un rodillo
function stopSpin(slotIndex){
  const slot = slots[slotIndex];
  cancelAnimationFrame(animations[slotIndex]);

  const randomIndex = Math.floor(Math.random()*items.length);
  results[slotIndex] = randomIndex;
  const finalOffset = randomIndex*itemHeight;

  const currentTransform = getComputedStyle(slot).transform;
  let currentPos = 0;
  if(currentTransform!=="none"){
    const matrix = new DOMMatrix(currentTransform);
    currentPos = matrix.m42;
  }

  let distance = -finalOffset - currentPos;
  if(distance>0) distance -= items.length*itemHeight;

  slot.style.transition="transform 2s cubic-bezier(0.25,1,0.5,1)";
  slot.style.transform=`translateY(${currentPos+distance}px)`;

  setTimeout(()=>{
    slot.style.transition="none";
    slot.style.transform=`translateY(-${finalOffset}px)`;
    slot.querySelectorAll("span").forEach(s=>s.classList.remove("highlight"));
    slot.querySelectorAll("span")[randomIndex].classList.add("highlight");
    slot.classList.remove("spinning");

    stopSound.currentTime=0;
    stopSound.play();

    // Marcamos que este rodillo ha parado
    spinning[slotIndex]=false;

    // Solo si todos los rodillos han parado, mostramos el mensaje y partículas
    if(spinning.every(s => !s)){
      slots.forEach(s=>s.querySelector("span.highlight").classList.add("pulse"));
      spinSound.pause();
      spinSound.currentTime=0;
      showMessage();
    }
  }, 2000);
}

// Mostrar mensaje según resultado y crear partículas
function showMessage(){
  const [a,b,c] = results.map(i=>items[i]);
  let msg="", particleCount=20;
  if(a===b && b===c){
    msg="💥 Triple coincidencia! Full-stack!";
    particleCount=60;
    dingSound.play();
  } else if(a===b || b===c || a===c){
    msg="✨ ¡Pareja de habilidades!";
    particleCount=40;
    dingSound.play();
  } else msg="🎯 Combinación aleatoria.";
  message.textContent=msg;
  createParticles(message, particleCount);
}

// Crear partículas dinámicas
function createParticles(target, count=20){
  const rect = target.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const p=document.createElement("div");
    p.className="particle";
    p.style.left = `${rect.left+rect.width/2}px`;
    p.style.top = `${rect.top+rect.height/2}px`;
    const x = (Math.random()-0.5)*200;
    const y = (Math.random()-0.5)*200;
    p.style.setProperty('--x',`${x}px`);
    p.style.setProperty('--y',`${y}px`);
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),1000);
  }
}

// Evento para girar todos los rodillos
spinBtn.addEventListener("click",()=>{
  spinBtn.disabled=true;
  message.textContent="";
  slots.forEach((_,i)=>startSpin(i));
  spinSound.currentTime=0;
  spinSound.play();

  // Parar cada rodillo escalonadamente
  slots.forEach((_,i)=>setTimeout(()=>stopSpin(i),1500 + i*800));

  // Rehabilitar botón después de que todos terminen
  setTimeout(()=>spinBtn.disabled=false, 4000);
});
