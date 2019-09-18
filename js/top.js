var mapCount = 0;
var v_map;
var markersArray = [];
var image ;
var geocoder = new google.maps.Geocoder();

$("#searchLocation").click(function() {
	codeAddress();
});

$("#video_location").keydown(function (key) {
	if(key.keyCode == 13) {
		codeAddress();
	}
});

function mapVeiw(){
	if(mapCount == 0){
		$('#modal-message').modal('show'); 
		location_map_initialize();
		mapCount++;
	}else{
		$('#modal-message').modal('show'); 
	}
}

function geocodePosition(pos) {
	geocoder.geocode({
		latLng: pos
	}, function(responses) {
		if (responses && responses.length > 0) {
			updateMarkerAddress(responses[1].formatted_address);
		} else {
			updateMarkerAddress('이 위치에 주소를 확인할 수 없습니다.');
		}
	});
}
	

function updateMarkerPosition(latLng) {
	var data = [latLng.lat(),latLng.lng()].join(', ');
	$('#lat').val(latLng.lat());
	$('#long').val(latLng.lng());
	$('#isMarker').val('1');
}

function updateMarkerAddress(str) {
	$('#video_location').val(str);
}
	
function location_map_initialize() {
	var myLatlng = new google.maps.LatLng('37.554531','126.97066300000006'); // Add the coordinates
	var mapOptions = {
			zoom: 8, // The initial zoom level when your map loads (0-20)
			center: myLatlng, // Centre the Map to our coordinates variable
			mapTypeId: google.maps.MapTypeId.ROADMAP, // Set the type of Map
	}
	v_map = new google.maps.Map(document.getElementById('top-map'), mapOptions); // Render our map within the empty div
	image = new google.maps.MarkerImage( '/resources/img/marker-featured.png', null, null, null, null); //new google.maps.Size(24,24) Create a variable for our marker image.
		
	var marker = new google.maps.Marker({ // Set the marker
		position: myLatlng, // Position marker to coordinates
		icon:image, //use our image as the marker
		map: v_map, // assign the market to our map variable
		draggable:true
	});
		
	google.maps.event.addListener(marker, 'drag', function() {
		updateMarkerPosition(marker.getPosition());
		geocodePosition(marker.getPosition());
	});
		
	google.maps.event.addListener(marker, 'dragend', function() {
		updateMarkerPosition(marker.getPosition());
		geocodePosition(marker.getPosition());
	});
		
	google.maps.event.addListener(v_map, "click", function(event){
		placeMarker(event.latLng);
		updateMarkerPosition(event.latLng);
		geocodePosition(event.latLng);
	});
	    
	markersArray.push(marker);        
}

function placeMarker(location) {
	deleteOverlays();

	var marker = new google.maps.Marker({
		position: location,
		icon:image, 
		map: v_map,
		draggable:true,
	});

	// add marker in markers array
	markersArray.push(marker);
	//map.setCenter(location);
}

function deleteOverlays() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

function codeAddress() {
	var address = $('#video_location').val();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			$('#lat').val(results[0].geometry.location.A);
		    $('#long').val(results[0].geometry.location.F);
		    $('#isMarker').val('1');
		    v_map.setCenter(results[0].geometry.location);
		    updateMarkerAddress(results[0].formatted_address);
		    placeMarker( results[0].geometry.location);
	    } else {
	      alert('이 위치에 주소를 확인할 수 없습니다.');
	    }
	});
}

function popClose(){
	$('#modal-message').modal('hide'); 
}

function videoSubmit(){
	var video_location = $("#video_location").val();
	var lat = $("#lat").val();
	var long = $("#long").val();
	var video_url = $("#video_url").val();
	var video_title = $("#video_title").val();
	var video_info = $("#video_info").val();
	$.ajax({
		url : "/video/videoInsert",
		type : "POST",
		data : {"tvd_location" : video_location
	    	  , "tvd_latitude" : lat
	    	  , "tvd_longitude" : long
	    	  , "tvd_url" : video_url
	    	  , "tvd_title" : video_title
	    	  , "tvd_info" : video_info
	    },
	    dataType : "json",
	    cache : false ,
	    success : function(data) {
	    	if(data.result == 1){
	    		alert("등록이 완료 되었습니다.");
	    		location.href = location.href; 
	    	}else{
	    		alert("등록이 실패 하였습니다.\n관리자에게 문의 하세요.");
	    	}
	    }
	});
}
