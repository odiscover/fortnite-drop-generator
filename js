var img,canvas,ctx, spotX, spotY;
var width, height;
var busStart, busEnd
var count = 0;
var useBattleBusRoute = false;
var battleBusRadius = 12;
var flightRouteInfluencePercent= 0.5;
var maxFlightDistance = 400;
var circleMoving = 0;
var oldLocation,newLocation;
var animationCount=0;
var allPOIs=[];
var poiMode = false;


window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function Vector(x,y){
  this.x=x;
  this.y=y;
  this.abs = function(){
    return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
  }
  this.norm =function(){
     let abs = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
     return new Vector(this.x/abs,this.y/abs);
  }


}

function PointOfInterest(x,y,width, height, chestAmount, name){
  this.x=x;
  this.y=y;
  this.height=height;
  this.width=width;
  this.chestAmount=chestAmount;
  this.name = name;
}

function DropLocation(x,y,radius){
  this.x=x;
  this.y=y;
  this.radius=radius

}

function BattleBus (x,y) {
    this.x = x;
    this.y = y;
    this.isDragging = false;
}

function initPOIs(){
  allPOIs.push(new PointOfInterest(231,232,49,68,0,'Pleasant Park'))
  allPOIs.push(new PointOfInterest(439,173,77,74,0,'Anarchy Acres'))
  allPOIs.push(new PointOfInterest(583,270,29,24,0,'Tomato Town'))
  allPOIs.push(new PointOfInterest(735,254,25,25,0,'Wailing Woods'))
  allPOIs.push(new PointOfInterest(780,349,51,58,0,'Lonely Lodge'))
  allPOIs.push(new PointOfInterest(641,460,62,39,0,'Retail Row'))
  allPOIs.push(new PointOfInterest(517,392,20,34,0,'Dusty Depot'))
  allPOIs.push(new PointOfInterest(340,322,17,41,0,'Loot Lake West'))
  allPOIs.push(new PointOfInterest(392,330,9,12,0,'Loot Lake Center'))
  allPOIs.push(new PointOfInterest(180,535,47,44,0,'Greasy Grove'))
  allPOIs.push(new PointOfInterest(303,765,29,34,0,'Flush Factory'))
  allPOIs.push(new PointOfInterest(485,539,53,35,0,'Salty Spring'))
  allPOIs.push(new PointOfInterest(516,655,52,77,0,'Fatal Fields'))
  allPOIs.push(new PointOfInterest(675,648,26,26,0,'Prison'))
  allPOIs.push(new PointOfInterest(723,650,56,95,0,'Moisty Mire'))
  allPOIs.push(new PointOfInterest(643,348,31,32,0,'Containers'))
  allPOIs.push(new PointOfInterest(749,437,14,30,0,'Trailer Park'))
  allPOIs.push(new PointOfInterest(555,469,22,27,0,'Factory Buildings'))
  allPOIs.push(new PointOfInterest(707,145,39,22,0,'Houses and Truck'))

}


function init(){

    img = document.getElementById("map");
    width = img.clientWidth;
    height = img.clientHeight;
    canvas=document.getElementById("canvas");
    canvas.setAttribute("height",height)
    canvas.setAttribute("width",width)
    bufferCanvas = document.getElementById("backgroundCanvas");
    bufferCanvas.width=canvas.width;
    bufferCanvas.height=canvas.height;
    bufferCtx = bufferCanvas.getContext("2d");
    ctx=canvas.getContext("2d");


    bufferCtx.drawImage(img, 0, 0, img.width, img.height);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('click',mouseClick,false);
    busStart = new BattleBus(width/2,height/2);
    busEnd = new BattleBus(width/2,height/2);
    oldLocation = new DropLocation(150,150,slider.getValue());
    newLocation = new DropLocation(0,0,slider.getValue());
    initPOIs();
    loop();
    initBusLocations();

  }


function drawDropSpot(radius, x,y){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  //Bus Markers
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000000';
  ctx.stroke();
}

function initBusLocations(){
  let startVector = [1,1];
  let reachedWaterStart = false;
  let reachedWaterEnd = false;
  while(!reachedWaterStart){

    busStart.x+=startVector[0];
    busStart.y+=startVector[1];
    let imgData = bufferCtx.getImageData(busStart.x,busStart.y,1,1);
    if(imgData.data[0]>10 && imgData.data[0]< 30 && imgData.data[1] >40 && imgData.data[1]<50 && imgData.data[2]>60 && imgData.data[2]<70 ){
      reachedWaterStart=true;
    }

  }
  while(!reachedWaterEnd){

    busEnd.x-=startVector[0];
    busEnd.y-=startVector[1];
    let imgData = bufferCtx.getImageData(busEnd.x,busEnd.y,1,1);
    if(imgData.data[0]>10 && imgData.data[0]< 30 && imgData.data[1] >40 && imgData.data[1]<50 && imgData.data[2]>60 && imgData.data[2]<70 ){
      reachedWaterEnd=true;
    }

  }
}





function drawBattleBusmarkers(){
  ctx.beginPath();
  let radius = battleBusRadius;

  ctx.arc(busStart.x, busStart.y, radius, 0, 2 * Math.PI, false);
  ctx.strokeStyle = '#AF3E35';
  ctx.fillStyle='rgba(255, 229, 229,0.5)';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(busEnd.x, busEnd.y, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#254668';
  ctx.fillStyle='rgba(255, 229, 229,0.5)';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(busStart.x,busStart.y);
  ctx.lineTo(busEnd.x,busEnd.y);
  ctx.stroke();
  ctx.closePath();


  let busVector = new Vector(busEnd.x-busStart.x,busEnd.y-busStart.y);
  let flightDist=flightDistslider.getValue();
  let busVectorNormed = busVector.norm();


  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 204, 255,0)';
  ctx.moveTo(busStart.x,busStart.y)
  ctx.lineTo(busStart.x+busVectorNormed.y*flightDist,busStart.y-busVectorNormed.x*flightDist)

  ctx.lineTo(busEnd.x+busVectorNormed.y*flightDist,busEnd.y-busVectorNormed.x*flightDist)

  ctx.lineTo(busEnd.x,busEnd.y)

  ctx.lineTo(busEnd.x-busVectorNormed.y*flightDist,busEnd.y+busVectorNormed.x*flightDist)
  ctx.lineTo(busStart.x-busVectorNormed.y*flightDist,busStart.y+busVectorNormed.x*flightDist)

  ctx.fillStyle = 'rgba(255, 204, 255,0.5)';
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(busStart.x,busStart.y);
  let angle1=-Math.acos(busVectorNormed.x) -Math.PI/2;
  if(busVectorNormed.y>0){
    angle1=-angle1 +Math.PI;
  }
  ctx.arc(busStart.x,busStart.y,flightDist, angle1- Math.PI,angle1 , false);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(busEnd.x,busEnd.y);
  let angle2=-Math.acos(busVectorNormed.x) +Math.PI/2;
  if(busVectorNormed.y>0){
    angle2=-angle2 +Math.PI;
  }
  ctx.arc(busEnd.x,busEnd.y,flightDist, angle2- Math.PI,angle2 , false);
  ctx.fill();
  ctx.closePath();

}

function chooseSpot(){
  poiMode=document.getElementById("poiMode").checked;
  let randomX =15+ Math.random()*(width-15);
  let randomY =15+ Math.random()*(height-15);
  if(poiMode){
    tempPOI=allPOIs[parseInt(Math.random()*allPOIs.length)];
    randomX=tempPOI.x+tempPOI.width/2;
    randomY=tempPOI.y+tempPOI.height/2;
  }
  if(useBattleBusRoute) {
  var rndSeed= Math.random();

  var distance = Math.abs((busEnd.x-busStart.x)*(busStart.y-randomY)-(busStart.x-randomX)*(busEnd.y-busStart.y)) / Math.sqrt(Math.pow(busEnd.x-busStart.x,2) + Math.pow(busEnd.y-busStart.y,2))
  maxFlightDistance = flightDistslider.getValue();
  //flightRouteInfluencePercent = document.getElementById("flightInfluence").value/100;
  //&& rndSeed <flightRouteInfluencePercent
    if(distance> maxFlightDistance ){
      chooseSpot();
      return;
    }
  }

  //Check if the hsl value of the spot is >205 and <210 (Then it is approximately water)
  var imgData = bufferCtx.getImageData(randomX,randomY,1,1);

  if(imgData.data[0]>10 && imgData.data[0]< 30 && imgData.data[1] >40 && imgData.data[1]<50 && imgData.data[2]>60 && imgData.data[2]<70 ){
    //Spot in water
    chooseSpot();
    return;
  }

  newLocation.x=randomX;
  newLocation.y=randomY;
  newLocation.radius=100;

  animationCount+=1;

}

function mouseDown(e) {
  mouseX=e.clientX
  mouseY=e.clientY
  if(mouseX >= (busStart.x - battleBusRadius) && mouseX <= (busStart.x + battleBusRadius) && mouseY >= (busStart.y - battleBusRadius) && mouseY <= (busStart.y + battleBusRadius)){
    busStart.isDragging=true;
  } else if (mouseX >= busEnd.x - battleBusRadius && mouseX <= busEnd.x + battleBusRadius && mouseY >= busEnd.y - battleBusRadius && mouseY <= busEnd.y + battleBusRadius){
    busEnd.isDragging=true;
  }
}

var slider = new Slider('#radius', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});
var flightDistslider = new Slider('#maxFlight', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

function mouseUp(e){
  busStart.isDragging=false;
  busEnd.isDragging=false;
}
function mouseMove(e){

  if(busStart.isDragging){
    let direction = new Vector(e.clientX-busEnd.x,e.clientY-busEnd.y);
    let normedDirection = direction.norm();
    busStart.x=busEnd.x+normedDirection.x*10;
    busStart.y=busEnd.y+normedDirection.y*10;

    let reachedWaterStart = false;
    while(!reachedWaterStart){

      let imgData = bufferCtx.getImageData(busStart.x,busStart.y,1,1);
      if(imgData.data[0]>10 && imgData.data[0]< 30 && imgData.data[1] >40 && imgData.data[1]<50 && imgData.data[2]>60 && imgData.data[2]<70 ){
        reachedWaterStart=true;
        break;
      }
      busStart.x+=normedDirection.x;
      busStart.y+=normedDirection.y;

    }

  }else if(busEnd.isDragging){
    let direction = new Vector(e.clientX-busStart.x,e.clientY-busStart.y);
    let normedDirection = direction.norm();
    busEnd.x=busStart.x+normedDirection.x*10;
    busEnd.y=busStart.y+normedDirection.y*10;

    let reachedWaterStart = false;
    while(!reachedWaterStart){

      let imgData = bufferCtx.getImageData(busEnd.x,busEnd.y,1,1);
      if(imgData.data[0]>10 && imgData.data[0]< 30 && imgData.data[1] >40 && imgData.data[1]<50 && imgData.data[2]>60 && imgData.data[2]<70 ){
        reachedWaterStart=true;
        break;
      }
      busEnd.x+=normedDirection.x;
      busEnd.y+=normedDirection.y;

}

  }
}

function mouseClick(e){
  // console.log('X: '+ e.clientX)
  // console.log('Y: '+e.clientY)
}




var loop = function(){
  console.log('lol')
  let radius = slider.getValue();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  useBattleBusRoute = document.getElementById('busRoute').checked;
    if(useBattleBusRoute){
        drawBattleBusmarkers()

    }

    if(animationCount>0){
      if(animationCount<50){
        oldLocation.radius+=15;
      }else{
        oldLocation.radius-=15;
      }
      if(animationCount>50){
        oldLocation.x=newLocation.x;
        oldLocation.y=newLocation.y;
      }
      animationCount+=1;
      if(animationCount==100){
        animationCount=0;
        oldLocation.radius=radius;
      }

    }
    else {
      oldLocation.radius=radius;
    }
    drawDropSpot(oldLocation.radius,oldLocation.x,oldLocation.y)

    requestAnimationFrame(loop);


};
