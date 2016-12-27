//	MandljevKruh

var risalnaPovrsinaX = window.innerWidth;
var risalnaPovrsinaY = window.innerHeight;
//var risalnaPovrsinaX = 640;
//var risalnaPovrsinaY = 360;
var zacetniObseg = 2;

var scalingY = risalnaPovrsinaY / risalnaPovrsinaX;
var maxPonovitev = 500;
var ponovitev = 0;
var vrednosti;
var niCez;
var zoom = 1;
var dispX = 0;
var dispY = 0;
var sprememba = 0;
var ostPikslov;
var vsehPikslov;
var buffPodpiksli;
var pi = Math.pi;

function setup() {
	
	createCanvas(risalnaPovrsinaX, risalnaPovrsinaY);
	background(0, 0, 0);
	vsehPikslov = width * height;
	ostPikslov = vsehPikslov;
	ponovitev = 0;
	
	buffPodpiksli = new ArrayBuffer(12 * vsehPikslov);
	
	vrednosti = new Array(width);
	podpiksli = new Uint8ClampedArray(buffPodpiksli);
	niCez = new Array(width);
	
	for (var i = 0; i < width; i++) {
		
		vrednosti[i] = new Array(height);
		niCez[i] = new Array(height);
		
		for (var j = 0; j < height; j++) {
			
			vrednosti[i][j] = [0, 0, 0, 0, 0, 0, 0, 0];
			niCez[i][j] = [true, true, true, true, true];
		}
	}
	
	loadPixels();
	print("Resolucija slike: " + width + " * " + height + ", zoom: " + zoom + ", dispX: " + dispX + ", dispY: " + dispY);
}

function draw() {
	
	if (sprememba != 0) {
		
		background(0, 0, 0);
		ponovitev = 0;
		
		dispX = mapajXNaPovrsino(mouseX, 1);
		dispY = mapajYNaPovrsino(mouseY, 1);
		
		if (sprememba == 2) {
			zoom *= 0.5;
		}
		else if (sprememba == 1) {
			zoom *= 2;
		}
		
		print("Zoom: " + zoom + ", dispX: " + dispX + ", dispY: " + dispY);
		
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				
				vrednosti[x][y] = [0, 0, 0, 0, 0, 0, 0, 0];
				niCez[x][y] = [true, true, true, true, true];
			}
		}
		
		for (var i = 0; i < 12 * vsehPikslov; i++) {
			
			podpiksli[i] = 0;
		}
		
		sprememba = 0;
		ostPikslov = vsehPikslov;
	}
	
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (niCez[x][y][4]) {
				
				iteracija(x, y);
			}
		}
	}
	
	ponovitev++;
	
	updatePixels();
	print("Ponovitev: " + ponovitev + ", preostanek pikslov: " + ostPikslov + " od " + vsehPikslov  + " - " + (100 * ostPikslov / vsehPikslov) + " %");
	
	if (ponovitev >= maxPonovitev) {
		
		noLoop();
	}
}

function mouseWheel (event) {
	
	if (event.delta > 1) {
		
		sprememba = 2;
		print("Zoom /2");
	}
	
	else {
		
		sprememba = 1;
		print("Zoom *2");
	}
	
	loop();
	
	return false;
}


function mapajXNaPovrsino (vrednost, faktor) {
	
	return map(vrednost, 0, width * faktor, -zacetniObseg / zoom + dispX, zacetniObseg / zoom + dispX);
}

function mapajYNaPovrsino (vrednost, faktor) {
	
	return map(vrednost, 0, height * faktor, zacetniObseg * scalingY / zoom + dispY, -zacetniObseg * scalingY / zoom + dispY);
}

function mandelbriraj (objekt, idx, c, d) {
	
	var tempA = objekt[idx] * objekt[idx] - objekt[idx + 1] * objekt[idx + 1];
	var tempB = 2 * objekt[idx] * objekt[idx + 1];

	objekt[idx] = tempA + c;
	objekt[idx + 1] = tempB + d;
}

function intRdece (x) {
	
	if (x <= 1) {
		
		return 0;
	}
	else if (x <= 2) {
		
		return 192 * (0.5 * cos(x * pi) + 0.5);
	}
	else if (x <= 3) {
		
		return 192 + 63 * (x - 2);
	}
	else {
		return 255;
	}
}

function intZelene (x) {
	
	if (x <= 1) {
		
		return 0;
	}
	else if (x <= 2) {
		
		return 192 * (0.5 * cos(x * pi) + 0.5);
	}
	else if (x <= 3) {
		
		return 192 + 63 * (x - 2);
	}
	else {
		return 255;
	}
}

function intModre (x) {
	
	if (x <= 1) {
		
		return 255 * sqrt(-x * (x - 2));
	}
	else if (x <= 3) {
		
		return 255 * (0.5 * cos((x - 1) * pi) + 0.5);
	}
	else {
		
		return 255;
	}
}

function iteracija (x, y) {
	
	var idPiksla = 4 * (y * width + x);
	var prev = [[0, 0], [0, 0], [0, 0], [0, 0]];
	
	for (var i = 0; i < 4; i++) {
		
		prev[i][0] = vrednosti[x][y][2 * i];
		prev[i][1] = vrednosti[x][y][2 * i + 1];
	}
	
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 2; j++) {
			if (niCez[2 * i + j]) {
				
				var c = mapajXNaPovrsino(x + 0.5 * j, 1);
				var d = mapajYNaPovrsino(y + 0.5 * i, 1);
				var idx = 2 * (2 * i + j);
				
				mandelbriraj(vrednosti[x][y], idx, c, d);
				var trenutnaVrednost =
					vrednosti[x][y][idx] *
					vrednosti[x][y][idx] +
					vrednosti[x][y][idx + 1] *
					vrednosti[x][y][idx + 1];
				
				if (trenutnaVrednost >= 4) {
					
					if (trenutnaVrednost > 16) {
						trenutnaVrednost = 16;
					}
					
					niCez[x][y][2 * i + j] = false;
					
					intenzivnost = map (trenutnaVrednost, 16, 4, ponovitev - 1, ponovitev);
					intenzivnost /= maxPonovitev / 10;
					
					podpiksli[12 * (x + y * width) + 6 * i + 3 * j] = intRdece(intenzivnost);
					podpiksli[12 * (x + y * width) + 6 * i + 3 * j + 1] = intZelene(intenzivnost);
					podpiksli[12 * (x + y * width) + 6 * i + 3 * j + 2] = intModre(intenzivnost);
				}
				else if ((prev[2 * i + j][0] - vrednosti[x][y][idx]) ** 2 < 0.00001 && (prev[2 * i + j][1] - vrednosti[x][y][idx + 1]) ** 2 < 0.00001) {
					
					niCez[x][y][2 * i + j] = false;
				}
			}
		}
	}
	
	if (!niCez[x][y][0] && !niCez[x][y][1] && !niCez[x][y][2] && !niCez[x][y][3]) {
		niCez[x][y][4] = false;
		ostPikslov--;
	}
	
	var avgR = 0;
	var avgG = 0;
	var avgB = 0;
	
	for (var i = 0; i < 4; i++) {
		
		avgR += podpiksli[12 * (x + y * width) + 3 * i];
		avgG += podpiksli[12 * (x + y * width) + 3 * i + 1];
		avgB += podpiksli[12 * (x + y * width) + 3 * i + 2];
	}
	
	avgR /= 4;
	avgG /= 4;
	avgB /= 4;
	
	pixels[idPiksla] = avgR;
	pixels[idPiksla + 1] = avgG;
	pixels[idPiksla + 2] = avgB;
	pixels[idPiksla + 3] = 255
	
}