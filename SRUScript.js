$(document).ready(function() {
	$('#term').focus(function() {
		var full = $("#OutputSection").has("div").length ? true : false;
		if (full == false) {
			$('#OutputSection').empty();
		}
	});
	var getResponse = function() {
		parser = new DOMParser();
		var suggestIndex = "suggest00"
		var query = $('#query').val();
		//query = query.replace(/\-|\(|\)|:/g, "");
		//query = query.replace(/ /g, "%20");
		var searchfacet = $('#searchfacet').val();
		var numRecords = $('#numRecords').val();
		var startRecord = $('#startRecord').val();
		var fullstring = '';
		var authName = '';
		var suggestedName = '';
		var fastID = '';
		$(".row").remove();
		if (query == '') {
			$('#OutputSection').html("<h2 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h2>");
		} else {
			$('#OutputSection').html("<h2 class='loading'>Working</h2>");
			$.ajax({
				type: "GET",
				url: 'https://cors-anywhere.herokuapp.com/experimental.worldcat.org/fast/search?query=' + searchfacet + '+all+"' + query + '"' + '&httpAccept=application/xml&maximumRecords='+ numRecords + '&startRecord=' + startRecord +'&sortKey=usage&recordSchema=info:srw/schema/1/rdf-v2.0',
				cache: false,
				dataType: "xml",
				success: function(xml) {
					var records = xml.getElementsByTagName("record");
					for (var i = 0; i < records.length; i++) {
						var suggestedName = '';						
						tempXML = (parser.parseFromString(records[i].outerHTML, "text/xml"));
						fastID = tempXML.getElementsByTagName('dct:identifier')[0].childNodes[0].nodeValue;
						//console.log(fastID);
						authName = tempXML.getElementsByTagName('skos:prefLabel')[0].childNodes[0].nodeValue;
						//console.log(authName);
						//suggestedName = '';
						suggestedNameBundle = tempXML.getElementsByTagName("skos:altLabel");
						//console.log(suggestedNameBundle);
						for (var j = 0; j < suggestedNameBundle.length; j++) {
							//console.log(suggestedNameBundle[j].childNodes[0].nodeValue);
							if (j == 0) {
								suggestedName = suggestedNameBundle[j].childNodes[0].nodeValue;
							} else {
								suggestedName = suggestedName + ';<br/>' + suggestedNameBundle[j].childNodes[0].nodeValue;
							}
						}
						var tblRow = "<tr class='row'>" + "<td>" + authName + "</td>" + "<td>" + suggestedName + "</td>" + "<td>" + fastID + "</td>" + "</tr>";
						//+ "<td>" + f.job + "</td>" + "<td>" + f.roll + "</td>" + "</tr>"
						$(tblRow).appendTo("#OutputData tbody");
					}
					$('#OutputSection').html("<h2 class='loading'>Success</h2>");
				}
			});
		}
		return false;
	};
	$('#searchbutton').click(getResponse);
	$('#query').keyup(function(event) {
		if (event.keyCode == 13) {
			getResponse();
		}
	});

	function commonStyle(res) {
		return res["auth"];
	}
});