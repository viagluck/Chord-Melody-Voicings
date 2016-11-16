$(document).ready(function(){

	var paper = Raphael("paper");

	/* 
	Martin D-28:
	 frets: 20
	 scale length: 25.4"
	 width at nut: 1-11/16" (1.6875")
	 width at 12f: 2-1/8" (2.125")
	 dots: 5th, 2 on 7th, 9th, 2 on 12th, 15th, 17th
	 */

	var scaleLength = 1200,
		fretWidth = (scaleLength/25.4)*2.125,
		horizontalOffset = 30, 
		verticalOffset = 30;

	function drawFretboard(numFrets, numStrings){
		// draw frets
		for(var fret = 0; fret <= numFrets; fret++){
			var distanceFromNut = (scaleLength-(scaleLength/Math.pow(2,fret/12))) + horizontalOffset;
			paper.path("M" + distanceFromNut + " " + verticalOffset + " v" + fretWidth).attr({"stroke-width" : 2});
		}
		// draw strings
		for(var string = 0; string <numStrings; string++){
			var y = verticalOffset+((fretWidth/(numStrings-1)*string));
			paper.path("M " + horizontalOffset + " " + y + " h" + distanceFromNut);
		}
		// draw fret dots
		var dotColor = "#dedede";
		var dotRadius = 4;
		for(var i = 5; i < numFrets; i+=2){
			if(i <= 9){
				var fromNutToInitialFret = (scaleLength-(scaleLength/Math.pow(2,(i-1)/12)));
				var fromNutToNextFret = (scaleLength-(scaleLength/Math.pow(2,i/12)));
				var midPointOfFrets = (fromNutToNextFret-fromNutToInitialFret)/2;
				var dotX = horizontalOffset + fromNutToInitialFret + midPointOfFrets;
				var dotY = verticalOffset+fretWidth/2;
				paper.circle(dotX,dotY,dotRadius).attr({stroke: "none", fill: dotColor});
			}
			else if(i == 11){
				i++;
				fromNutToInitialFret = (scaleLength-(scaleLength/Math.pow(2,(i-1)/12)));
				fromNutToNextFret = (scaleLength-(scaleLength/Math.pow(2,i/12)));
				midPointOfFrets = (fromNutToNextFret-fromNutToInitialFret)/2;
				dotX = horizontalOffset + fromNutToInitialFret + midPointOfFrets;
				dotY = verticalOffset+fretWidth/3.3333;
				paper.circle(dotX,dotY,dotRadius).attr({stroke: "none", fill: dotColor});
				dotY = verticalOffset+(fretWidth - fretWidth/3.3333);
				paper.circle(dotX,dotY,dotRadius).attr({stroke: "none", fill: dotColor});
			}
		}
	}
	
	drawFretboard(12,6);


	// voicing functions
	var numStrings = 6;
	var fingerCircleRadius = 8;
	var fingerCircleFill = "#787878";
	var fromNutToInitialFret, fromNutToNextFret, midPointOfFrets,coords;
	var voicing = {
		"root" : 0,
		"third" : 0,
		"fifth" : 0,
		"seventh" : 0
	}

	// initialize finger-placement circles to 0
	var circ = [paper.circle(0,0,0),paper.circle(0,0,0),paper.circle(0,0,0),paper.circle(0,0,0)];
	var circLabel = [paper.text(0,0,""),paper.text(0,0,""),paper.text(0,0,""),paper.text(0,0,"")];

	function getNoteCoordinates(stringNum, fretNum){
		stringNum = stringNum - 1;
		fromNutToInitialFret = (scaleLength-(scaleLength/Math.pow(2,(fretNum-1)/12)));
		fromNutToNextFret = (scaleLength-(scaleLength/Math.pow(2,fretNum/12)));
		midPointOfFrets = (fromNutToNextFret-fromNutToInitialFret)/2;
		var x = horizontalOffset + fromNutToInitialFret + midPointOfFrets;
		if(x < horizontalOffset)
			x = horizontalOffset - (fingerCircleRadius);
		
		var y = verticalOffset+((fretWidth/(numStrings-1)*stringNum));

		return coords = {"x" : x, "y" : y};

	}

	function adjustForChordQuality(voicing, quality){
		var major7 = 1, dominant7 = 2, minor7 = 3, minor7b5 = 4, diminished7 = 5, plus5 = 6;
				if(quality !== major7)
					--voicing.seventh;
				if(quality === minor7 || quality === minor7b5 || quality === diminished7)
					--voicing.third;
				if(quality === minor7b5 || quality === diminished7)
					--voicing.fifth;
				if(quality === diminished7)
					--voicing.seventh;
				if(quality === plus5)
					++voicing.fifth;

				return voicing;
	}

	function drawDrop2(rootNote, quality, melodyDegree){
		switch(melodyDegree){
			case 1:
			if(rootNote === 0)
				if (quality === 5 || quality === 4) // 5 is diminished7 4 is m7-5
					rootNote = 12;

				voicing.root = rootNote;
				voicing.fifth = rootNote;
				voicing.third = rootNote+1;
				voicing.seventh = rootNote+1;

				voicing = adjustForChordQuality(voicing, quality);

				coords = getNoteCoordinates(1,voicing.root);
				circ[0] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[0] = paper.text(coords.x,coords.y, "1");

				coords = getNoteCoordinates(2,voicing.fifth);
				circ[1] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[1] = paper.text(coords.x,coords.y, "5");

				coords = getNoteCoordinates(3,voicing.third);
				circ[2] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[2] = paper.text(coords.x,coords.y, "3");

				coords = getNoteCoordinates(4,voicing.seventh);
				circ[3] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[3] = paper.text(coords.x,coords.y, "7");

				break;

			case 3:
				if(rootNote > 9)
					rootNote = rootNote - 12;

				voicing.root = rootNote+2;
				voicing.fifth = rootNote+4;
				voicing.third = rootNote+4;
				voicing.seventh = rootNote+4;

				voicing = adjustForChordQuality(voicing, quality);

				coords = getNoteCoordinates(1,voicing.third);
				circ[0] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[0] = paper.text(coords.x,coords.y, "3");

				coords = getNoteCoordinates(2,voicing.seventh);
				circ[1] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[1] = paper.text(coords.x,coords.y, "7");

				coords = getNoteCoordinates(3,voicing.fifth);
				circ[2] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[2] = paper.text(coords.x,coords.y, "5");

				coords = getNoteCoordinates(4,voicing.root);
				circ[3] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[3] = paper.text(coords.x,coords.y, "1");
				break;

			case 5:
				if(rootNote > 6)
					rootNote = rootNote -12

				voicing.root = rootNote+5;
				voicing.fifth = rootNote+7;
				voicing.third = rootNote+6;
				voicing.seventh = rootNote+8;

				voicing = adjustForChordQuality(voicing, quality);

				coords = getNoteCoordinates(1,voicing.fifth);
				circ[0] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[0] = paper.text(coords.x,coords.y, "5");

				coords = getNoteCoordinates(2,voicing.root);
				circ[1] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[1] = paper.text(coords.x,coords.y, "1");

				coords = getNoteCoordinates(3,voicing.seventh);
				circ[2] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[2] = paper.text(coords.x,coords.y, "7");

				coords = getNoteCoordinates(4,voicing.third);
				circ[3] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[3] = paper.text(coords.x,coords.y, "3");
				break;

			case 7:
				if(rootNote > 3)
					rootNote = rootNote -12

				voicing.root = rootNote+9;
				voicing.fifth = rootNote+9;
				voicing.third = rootNote+9;
				voicing.seventh = rootNote+11;

				voicing = adjustForChordQuality(voicing, quality);

				coords = getNoteCoordinates(1,voicing.seventh);
				circ[0] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[0] = paper.text(coords.x,coords.y, "7");

				coords = getNoteCoordinates(2,voicing.third);
				circ[1] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[1] = paper.text(coords.x,coords.y, "3");

				coords = getNoteCoordinates(3,voicing.root);
				circ[2] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[2] = paper.text(coords.x,coords.y, "1");

				coords = getNoteCoordinates(4,voicing.fifth);
				circ[3] = paper.circle(coords.x,coords.y, fingerCircleRadius).attr({fill : "#DCDCDC"});
				circLabel[3] = paper.text(coords.x,coords.y, "5");
				break;
		}
	}

	function convertLetterToNumber(letter){
		switch(letter){
			case "e" : return 0; break;
			case "f" : return 1; break;
			case "fs":
			case "gb": return 2; break;
			case "g" : return 3; break;
			case "gs":
			case "ab": return 4; break;
			case "a" : return 5; break;
			case "as":
			case "bb": return 6; break;
			case "b" : return 7; break;
			case "c" : return 8; break;
			case "cs": 
			case "db": return 9; break;
			case "d" : return 10; break;
			case "ds":
			case "eb": return 11; break;
		}
	}

	var note, type, inversion;
	var topVoice = 1;

	var noteLabel = "";
	$(".note_button").click(function(){
		noteLabel = this.id;
		note = convertLetterToNumber(noteLabel);
		topVoice = 1;
		// clear quality
		$("#qualityLabel").html("");
		// clear voicing and labels
		for(var i in circ){
			circ[i].remove();
			circLabel[i].remove();
		}	
		// print new note
		$("#noteLabel").html(function(){
			if(noteLabel.includes("s",1)){
				noteLabel = noteLabel.replace("s", "&#9839;");
				return noteLabel.toUpperCase();
			}
			else if(noteLabel.includes("b",1)){
				noteLabel = noteLabel.substring(0,1) + "&#9837;";
				return noteLabel.toUpperCase();
			}
			else{
				return noteLabel.toUpperCase();
			}
		});
	});

	var qualityLabel = "";
	$(".type_button").click(function(){
		type = this.id;
		for(var i in circ){
			circ[i].remove();
			circLabel[i].remove();
		}	
		if(noteLabel !== ""){
			drawDrop2(parseInt(note), parseInt(type), topVoice);
			qualityLabel =$("#" + this.id).html();
			$("#qualityLabel").html(qualityLabel);
		}
	});

	$(".voicing_navigation_button").click(function(){

		if(noteLabel !== ""){
			if(this.id === "next"){
				if(topVoice === 7)
					topVoice = 1;
				else
					topVoice+=2;

			for(var i in circ){
				circ[i].remove();
				circLabel[i].remove();
			}	

			drawDrop2(parseInt(note), parseInt(type), topVoice);
			}
			else if(this.id === "previous"){
				if(topVoice === 1)
					topVoice = 7;
				else
					topVoice-=2;

			for(var i in circ){
				circ[i].remove();
				circLabel[i].remove();
			}	

			drawDrop2(parseInt(note), parseInt(type), topVoice);
			}
		}
	});

});