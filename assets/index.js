$(document).ready(function() {
  console.log("Azure API");
  $("#sendImage").on("click", function() {
    var ini = $(this);
    swal({
      title: 'Ambil Data . .',
      text: 'Tunggu Sebentar',
      timer: 1000,
      onOpen: () => {
        swal.showLoading();
      }
    }).then((result) => {
      var url = $("#image").val();
      processImage(url);
    });
  });
});

function processImage(url) {
  // **********************************************
  // *** Update or verify the following values. ***
  // **********************************************

  // Replace the subscriptionKey string value with your valid subscription key.
  var subscriptionKey = "8de644c4dbd5495783f125eb62d9a2de";

  // Replace or verify the region.
  //
  // You must use the same region in your REST API call as you used to obtain your subscription keys.
  // For example, if you obtained your subscription keys from the westus region, replace
  // "westcentralus" in the URI below with "westus".
  //
  // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
  // a free trial subscription key, you should not need to change this region.
  var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

  // Request parameters.
  var params = {
    "visualFeatures": "Categories,Description,Color",
    "details": "",
    "language": "en",
  };


  // Perform the REST API call.
  $.ajax({
      url: uriBase + "?" + $.param(params),

      // Request headers.
      beforeSend: function(xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
      },

      type: "POST",

      // Request body.
      data: '{"url": ' + '"' + url + '"}',
    })

    .done(function(data) {
      // Show formatted JSON on webpage.
      var dialog = bootbox.dialog({
          title: 'Mempersiapkan Data .',
          message: '<p align="center"><i class="fa fa-spin fa-spinner"></i> Loading ...</p>'
        });
        dialog.init(function() {
          var jsondata = data;
          dialog.find(".modal-title").html("Image Recognition");
          var htmlA = "";
          for(var i = 0; i < jsondata.categories.length; i++ ){
            htmlA += jsondata.categories[i].name+",";
          }
          var htmlB
          for(var i = 0; i < jsondata.description.tags.length; i++ ){
            htmlB += jsondata.description.tags[i]+",";
          }
          dialog.find(".bootbox-body").html("<div class='row'><div class='col-md-12'><center><img src='"+url+"' class='img-responsive'></img></center></div><div class='col-md-12'><p style='word-wrap: break-word'>Deskripsi : <b>"+htmlA+"</b></p><p style='word-wrap: break-word'>Tags : <b>"+htmlB+"</b></p></div></div>");
        });
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // Display error message.
      var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
      errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
      swal("Oops",errorString,"error");
    });
};
