/*****************************************************
 WEBGIS QUẢN LÝ THÚ Y ĐIỆN BIÊN
 Code.gs
*****************************************************/

function doGet(e){

  return ContentService
    .createTextOutput(
      JSON.stringify(getGISData())
    )
    .setMimeType(ContentService.MimeType.JSON);

}
