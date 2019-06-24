$(document).ready(function() {
	$('#term').focus(function() {
		var full = $("#OutputSection").has("div").length ? true : false;
		if (full == false) {
			$('#OutputSection').empty();
		}
	});
	var getResponse = function() {
		var suggestIndex = "suggest00"
		var query = $('#query').val();
		//query = query.replace(/\-|\(|\)|:/g, "");
		//query = query.replace(/ /g, "%20");
		var searchfacet = $('#searchfacet').val();
		var fullstring = '';
		$(".row").remove();
		if (query == '') {
			$('#OutputSection').html("<h2 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h2>");
		} else {
			$('#OutputSection').html("<h2 class='loading'>Working</h2>");
			$.ajax({
				type: "GET",
				url: 'http://fast.oclc.org/searchfast/fastsuggest?&query=' + '"' + query + '"' + '&queryIndex=' + searchfacet + '&queryReturn=suggestall%2Cauth%2Ctype%2C&suggest=autoSubject&rows=20&callback=KDMAPIPage',
				dataType: "jsonp",
				jsonp: 'json.wrf',
				success: function(data) {
					console.log(data)
					$.each(data.response.docs, function(i, f) {
						if (!fullstring.includes(f.auth)) {
							var tblRow = "<tr class='row'>" + "<td>" + f.suggestall + "</td>" + "<td>" + f.auth + "</td>" + "</tr>"
							//+ "<td>" + f.job + "</td>" + "<td>" + f.roll + "</td>" + "</tr>"
							$(tblRow).appendTo("#OutputData tbody");
							//fullstring = fullstring + f.auth; //Uncomment this to only display unique authoritative names
						}
					});
					$('#OutputSection').html("<h2 class='loading'>Success</h2>");
				}
			});
		}
		return false;
	};
	$('#search').click(getResponse);
	$('#query').keyup(function(event) {
		if (event.keyCode == 13) {
			getResponse();
		}
	});

	function commonStyle(res) {
		return res["auth"];
	}
});