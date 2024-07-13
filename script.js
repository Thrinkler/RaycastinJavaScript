var canvas = document.getElementById("2Dplane");
canvas.width = 1024+64*2;
canvas.height = 718;
var ctx = canvas.getContext("2d");
canvas.style.background = "#777777";

let PI = 3.1215926535
let PI2 = PI/2;
let PI3 = 3*PI/2
let DR = 0.0174533/2


let px = 300,py = 300,pa = 1,pdx=Math.cos(pa)*2,pdy=Math.sin(pa)*2;
document.addEventListener('keydown', keyDownHandler, false);

let keypressed = '';
function keyDownHandler(event) {
    if(keypressed != event.key){
        oldkey = keypressed;
    }

    keypressed = event.key;

}
document.addEventListener('keyup', keyUpHandler, false);

function keyUpHandler(event) {
    if(keypressed == event.key){
        keypressed=oldkey;
        oldkey = "";
    }
        


}



function movement (keypressed) {

    var keyValue = keypressed;
    let velocity = 2;
    switch (keyValue){
        case 'w':
            px-=pdx;
            py-=pdy;
            break;
        case 'a':
            pa-=0.05; 
            if (pa<0){pa+=2*PI} pdx=Math.cos(pa)*2;pdy=Math.sin(pa)*2;
            break;
        case 's':
            px+=pdx;
            py+=pdy;
            break;
        case 'd':
            pa+=0.05; 
            if (pa>2*PI){pa-=2*PI} pdx=Math.cos(pa)*2;pdy=Math.sin(pa)*2;
            break;
        }
}

function dist(ax,ay,bx,by,ang){
    return(Math.sqrt((bx-ax)*(bx-ax)+(by-ay)*(by-ay)));
}


function drawRays(px,py){
    let r,mx,my,mp,dof,rx=0,ry=0,xo,yo,disT;
    let ra = pa-DR*60;if(ra>0){ra+=2*PI;} if(ra>2*PI){ra-=2*PI};
    for (r =0;r<120;r++){

        //horizontal
        dof=0;
        let disH = 10000000,hx=px,hy=py;


        let aTan = (-1)/Math.tan(ra);
        if(ra<PI){ ry = ((py>>6)<<6)-0.0001; rx = (py-ry)*aTan+px; yo =-64;xo = -yo*aTan;}
        if(ra>PI){ ry = ((py>>6)<<6)+64.0001; rx = (py-ry)*aTan+px; yo =64;xo = -yo*aTan;}
        if(ra===0|| ra==PI){rx=px;ry=py;dof = 8;}

        while(dof <8){
            mx = rx>>6; my = ry>>6;mp = my*mapX+mx;
            if(mp >0 && mp<mapX*mapY && matrix[mp]==1){hx = rx; hy = ry; disH=dist(px,py,hx,hy,ra); dof = 8}

            else{rx+=xo; ry+=yo;dof+=1}
        }


        //vertical
        dof=0;
        let disV = 10000000,vx=px,vy=py;
        

        let nTan = -Math.tan(ra);
        if(ra>PI2 && ra<PI3){ rx = (((py>>6)<<6)+64.00001); ry = (px-rx)*nTan+py; xo =64;yo = -xo*nTan;}
        if(ra<PI2 || ra> PI3){ rx = (((py>>6)<<6)-0.0001); ry = (px-rx)*nTan+py; xo =-64;yo = -xo*nTan;}
        
        if(ra==0|| ra==PI){rx=px;ry=py;dof = 8;}

        while(dof <8){
            mx = rx>>6; my = ry>>6;mp = my*mapX+mx;
            if(mp >0 && mp<mapX*mapY && matrix[mp]===1){vx = rx; vy = ry; disV=dist(px,py,vx,vy,ra);dof = 8;}

            else{rx+=xo; ry+=yo;dof+=1}
        }

        if(disV<disH){rx=vx;ry=vy;disT=disV; ctx.fillStyle = "#FFFF00";}
        if(disV>disH){rx=hx;ry=hy;disT=disH; ctx.fillStyle = "#AAAA00";}

        let ca = pa-ra;if(ca<0){ca+=2*PI;}if(ca>2*PI){ca-=2*PI} disT*=Math.cos(ca)
        let lineH=(mapS*420)/disT; if(lineH>420){lineH=420;}


        let linwidth = 4, linx = 0;let linheight = lineH;
        let liny = (canvas.height - linheight)/2;
        ctx.fillRect(linx+530+r*linwidth,liny,linwidth,linheight);

        ctx.beginPath();ctx.strokeStyle = "green";ctx.lineWidth =1;  ctx.moveTo(px,py);ctx.lineTo(rx, ry);ctx.stroke();
        ra+=DR;if(ra>0){ra+=2*PI;} if(ra>2*PI){ra-=2*PI};
    }
}


function ddrawRays(px,py){
    let mx,my,mp,dof,vx,vy,rx,ry,ra,xo,yo,disV,disH;
    
    ra = pa-DR*60;if(ra>0){ra+=2*PI;} if(ra>2*PI){ra-=2*PI};
    for(let r=0;r<120;r++){
        
        dof=0; disV=100000;
        let Tan = -Math.tan(ra);
        //vamos a ver si está viendo a la derecha o a la izquierda

        if(Math.cos(ra)<-0.0001){  rx = (((px>>6)<<6)+64);      ry = (px-rx)*Tan+py; xo =64; yo = -xo*Tan;}
        else if(Math.cos(ra)>0.0001){  rx = (((px>>6)<<6)-0.0001); ry = (px-rx)*Tan+py; xo =-64;yo = -xo*Tan;}
        else { rx=px; ry=py; dof=8;}


        while(dof<8){
            mx = rx>>6;my=ry>>6;mp=my*mapX+mx;

            if(mp>0 && mp<mapX*mapY && matrix[mp]==1){dof=8;disV=dist(px,py,rx,ry,ra);}
            else{ rx+=xo; ry+=yo; dof+=1;} 
            
        }
        
        vx=rx; vy=ry;
        
        dof=0; disH=100000;
        Tan=1.0/Tan;
        if(Math.sin(ra)>0.0001){ ry = ((py>>6)<<6)-0.0001; rx = (py-ry)*Tan+px; yo =-64;xo = -yo*Tan;}
        else if(Math.sin(ra)<-0.0001){ ry = ((py>>6)<<6)+64; rx = (py-ry)*Tan+px; yo =64;xo = -yo*Tan;}
        else{ rx=px; ry=py; dof=8;}

        while(dof<8){
            mx = rx>>6;my=ry>>6;mp=my*mapX+mx;

            if(mp>0 && mp<mapX*mapY && matrix[mp]==1){dof=8;disH=dist(px,py,rx,ry,ra);}
            else{ rx+=xo; ry+=yo; dof+=1;} 
            
        }
        let hx=rx; let hy=ry;
        ctx.strokeStyle="green";ctx.fillStyle = "#FFFF00";

        if(disV<disH){rx=vx;ry=vy;disH=disV; ctx.strokeStyle = "yellow";ctx.fillStyle = "#AAAA00";}

        ctx.beginPath();ctx.lineWidth =1;  ctx.moveTo(px,py);ctx.lineTo(rx, ry);ctx.stroke();
        ra+=DR;if(ra>0){ra+=2*PI;} if(ra>2*PI){ra-=2*PI};

        let ca = pa-ra;if(ca<0){ca+=2*PI;}if(ca>2*PI){ca-=2*PI} disH*=Math.cos(ca)
        let lineH=(mapS*420)/disH; if(lineH>420){lineH=420;}
    
    
        let linwidth = 4, linx = 0;let linheight = lineH;
        let liny = (512 - linheight)/2;
        ctx.fillRect(linx+530+128+r*linwidth,liny,linwidth,linheight);
    }
}




function drawPlayer(px, py){
    ctx.fillStyle = "orange";
    ctx.fillRect(px,py,10,10);
    ctx.drawLine

    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.lineWidth =4;  
    ctx.moveTo(px,py);
    ctx.lineTo(px-pdx*20, py-pdy*20);
    ctx.stroke();

}





let mapX = 10, mapY= 11, mapS = 64;
matrix = [1,1,1,0,1,1,1,1,1,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,1,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,1,1,1,0,1,1,1,1,1]
function drawMap2d(){
    

    for(let y = 0; y<mapY;y++){
        for (let x =0; x<mapX;x++){
            if(matrix[y*mapX+x] ==1){ ctx.fillStyle = "blue"} else{ctx.fillStyle = "black"}
            let xo = x*mapS, yo = y*mapS;
            ctx.fillRect(xo+1,yo+1,mapS-1,mapS-1);
        }
    }
}

function draw(px,py){
    movement(keypressed)
    drawMap2d()
    drawPlayer(px,py)
    ddrawRays(px,py)
}

ctx.clearRect(0, 0,canvas.width, canvas.height)
const update = () => {
    ctx.clearRect(0, 0,canvas.width, canvas.height)
    draw(px,py)
    requestAnimationFrame(update)
}

requestAnimationFrame(update);

