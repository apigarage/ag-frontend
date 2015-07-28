angular.module('app').controller('EditorCtrl', [
  '$scope',
  '$timeout',
  '$modal',
  function ($scope, $timeout, $modal){

  // ----------------------------
  // Temporary MOCK Endpoint Use Case
  $scope.endpoint = {
    category: "Albums",
    name: "Get an Artist's Tracks",
    environment: 'production',
    requestMethod: 'GET',
    requestHeaders: [
      { key: "Content-Type", value: "application/json" },
      { key: "language", value: "EN" }
    ],
    requestBody: '{\n    "amount": "32.32",\n    "status": true\n}'
  };
  $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
  $scope.environments = ['local', 'staging', 'production'];
  $scope.response = null;
  $scope.responsePreviewTypes = ['Parsed', 'Raw', 'Preview'];
  $scope.responsePreviewType = ['Parsed'];

  $scope.setEnvironment = function(environment)
    {
      $scope.endpoint.environment = environment;
    };
  $scope.manageEnvironments = function()
    {
      var myModal = $modal({
        show: false,
        template: "html/environments.html",
        backdrop: true
      });

      myModal.$scope.environments  = $scope.environments;
      myModal.$promise.then( myModal.show );
    };
  $scope.setRequestMethod = function(method)
    {
      $scope.endpoint.requestMethod = method;
    };
  $scope.addRequestHeader = function()
    {
      $scope.endpoint.requestHeaders.push({});
    };
  $scope.deleteRequestHeader = function(header)
    {
      var position = $scope.endpoint.requestHeaders.indexOf( header );
      $scope.endpoint.requestHeaders.splice(position, 1);
    };

  // ----------------------------
  // Temporary MOCK Responses
  var randomRequestIndex = 1;
  //$scope.response = sampleResponses[1];
  $scope.performRequest = function()
    {
      $scope.response = "loading";

      // Randomly return one of the sample responses (declared at the bottom of the page)
      $timeout(function(){  // Emulate async
        $scope.response = sampleResponses[randomRequestIndex % 3];
        randomRequestIndex++;
      }, 500);
    };
  $scope.getResponseCodeClass = function(responseCode)
    {
      if( !responseCode )
        return 'fa-spinner fa-pulse';
      else if( responseCode >= 500 )
        return 'fa-circle icon-danger';
      else if( responseCode >= 400 )
        return 'fa-circle icon-warning';
      else
        return 'fa-circle icon-success';
    };
  $scope.setResponsePreviewType = function(previewType)
    {
      $scope.responsePreviewType = previewType;
    };

  $scope.requestBodyEditorOptions = {
    showGutter: false,
    theme: 'kuroir',
    mode: 'json',
    onLoad: function(editor){
      editor.setShowPrintMargin(false);
      editor.setHighlightActiveLine(false);
      editor.setDisplayIndentGuides(false);
      editor.setOptions({maxLines: Infinity});  // Auto adjust height!
      editor.$blockScrolling = Infinity; // Disable warning
    }
  };

  $scope.responseBodyEditorOptions = {
    showGutter: false,
    theme: 'kuroir',
    mode: 'json',
    onLoad: function(editor){
      editor.setShowPrintMargin(false);
      editor.setHighlightActiveLine(false);
      editor.setDisplayIndentGuides(false);
      editor.setOptions({maxLines: Infinity});  // Auto adjust height!
      editor.$blockScrolling = Infinity; // Disable warning
      editor.setReadOnly(true);
    }
  };

}]);




      // ----------------------------
      // Temporary MOCK Responses
      var sampleResponses = [
        {
          size: 128.1,
          time: 0.217,
          code: 404,
          status: 'Not Found'
        },
        {
          size: 59.2,
          time: 1.432,
          code: 200,
          status: 'OK',
          headers: {
            'Access-Control-Allow-Origin': true,
            'Date': 'Tue, 14 Jul 2015 20:30:28 GMT'
          },
          body: '{\n  "name": "Anson Kao",\n  "favourite-pet": "Doggiees!!!",\n  "points": 9001\n}'
        },
        {
          size: 1.9,
          time: 3.395,
          code: 500,
          status: 'Internal Server Error',
          headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'content-type': 'text/html; charset=UTF-8'
          },
          body: '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
  '<meta http-equiv="content-type" content="text/html; charset=utf-8">' +
  '<meta name="robots" content="NONE,NOARCHIVE">' +
  '<title>TypeError at /api/v1/organization/1235</title>' +
  '<style type="text/css">' +
    'html * { padding:0; margin:0; }' +
    'body * { padding:10px 20px; }' +
    'body * * { padding:0; }' +
    'body { font:small sans-serif; }' +
    'body>div { border-bottom:1px solid #ddd; }' +
    'h1 { font-weight:normal; }' +
    'h2 { margin-bottom:.8em; }' +
    'h2 span { font-size:80%; color:#666; font-weight:normal; }' +
    'h3 { margin:1em 0 .5em 0; }' +
    'h4 { margin:0 0 .5em 0; font-weight: normal; }' +
    'code, pre { font-size: 100%; white-space: pre-wrap; }' +
    'table { border:1px solid #ccc; border-collapse: collapse; width:100%; background:white; }' +
    'tbody td, tbody th { vertical-align:top; padding:2px 3px; }' +
    'thead th { padding:1px 6px 1px 3px; background:#fefefe; text-align:left; font-weight:normal; font-size:11px; border:1px solid #ddd; }' +
    'tbody th { width:12em; text-align:right; color:#666; padding-right:.5em; }' +
    'table.vars { margin:5px 0 2px 40px; }' +
    'table.vars td, table.req td { font-family:monospace; }' +
    'table td.code { width:100%; }' +
    'table td.code pre { overflow:hidden; }' +
    'table.source th { color:#666; }' +
    'table.source td { font-family:monospace; white-space:pre; border-bottom:1px solid #eee; }' +
    'ul.traceback { list-style-type:none; color: #222; }' +
    'ul.traceback li.frame { padding-bottom:1em; color:#666; }' +
    'ul.traceback li.user { background-color:#e0e0e0; color:#000 }' +
    'div.context { padding:10px 0; overflow:hidden; }' +
    'div.context ol { padding-left:30px; margin:0 10px; list-style-position: inside; }' +
    'div.context ol li { font-family:monospace; white-space:pre; color:#777; cursor:pointer; }' +
    'div.context ol li pre { display:inline; }' +
    'div.context ol.context-line li { color:#505050; background-color:#dfdfdf; }' +
    'div.context ol.context-line li span { position:absolute; right:32px; }' +
    '.user div.context ol.context-line li { background-color:#bbb; color:#000; }' +
    '.user div.context ol li { color:#666; }' +
    'div.commands { margin-left: 40px; }' +
    'div.commands a { color:#555; text-decoration:none; }' +
    '.user div.commands a { color: black; }' +
    '#summary { background: #ffc; }' +
    '#summary h2 { font-weight: normal; color: #666; }' +
    '#explanation { background:#eee; }' +
    '#template, #template-not-exist { background:#f6f6f6; }' +
    '#template-not-exist ul { margin: 0 0 0 20px; }' +
    '#unicode-hint { background:#eee; }' +
    '#traceback { background:#eee; }' +
    '#requestinfo { background:#f6f6f6; padding-left:120px; }' +
    '#summary table { border:none; background:transparent; }' +
    '#requestinfo h2, #requestinfo h3 { position:relative; margin-left:-100px; }' +
    '#requestinfo h3 { margin-bottom:-1em; }' +
    '.error { background: #ffc; }' +
    '.specific { color:#cc3300; font-weight:bold; }' +
    'h2 span.commands { font-size:.7em;}' +
    'span.commands a:link {color:#5E5694;}' +
    'pre.exception_value { font-family: sans-serif; color: #666; font-size: 1.5em; margin: 10px 0 10px 0; }' +
  '</style> ' +
'</head>' +
'<body>' +
'<div id="summary">' +
  '<h1>TypeError at /api/v1/organization/1235</h1>' +
  '<pre class="exception_value">&#39;NoneType&#39; object has no attribute &#39;__getitem__&#39;</pre>' +
  '<table class="meta">' +

    '<tr>' +
      '<th>Request Method:</th>' +
      '<td>GET</td>' +
    '</tr>' +
    '<tr>' +
      '<th>Request URL:</th>' +
      '<td>http://52.7.249.229:8000/api/v1/organization/1235</td>' +
    '</tr>' +

    '<tr>' +
      '<th>Django Version:</th>' +
      '<td>1.7.7</td>' +
    '</tr>' +

    '<tr>' +
      '<th>Exception Type:</th>' +
      '<td>TypeError</td>' +
    '</tr>' +


    '<tr>' +
      '<th>Exception Value:</th>' +
      '<td><pre>&#39;NoneType&#39; object has no attribute &#39;__getitem__&#39;</pre></td>' +
    '</tr>' +


    '<tr>' +
      '<th>Exception Location:</th>' +
      '<td>/home/ubuntu/qoi_django/server/restapp/views.py in get, line 807</td>' +
    '</tr>' +

    '<tr>' +
      '<th>Python Executable:</th>' +
      '<td>/usr/bin/python</td>' +
    '</tr>' +
    '<tr>' +
      '<th>Python Version:</th>' +
      '<td>2.7.6</td>' +
    '</tr>' +
    '<tr>' +
      '<th>Python Path:</th>' +
      '<td><pre>[&#39;/home/ubuntu/qoi_django/server&#39;,' +
 '&#39;/usr/lib/python2.7&#39;,' +
 '&#39;/usr/lib/python2.7/plat-x86_64-linux-gnu&#39;,' +
 '&#39;/usr/lib/python2.7/lib-tk&#39;,' +
 '&#39;/usr/lib/python2.7/lib-old&#39;,' +
 '&#39;/usr/lib/python2.7/lib-dynload&#39;,' +
 '&#39;/usr/local/lib/python2.7/dist-packages&#39;,' +
 '&#39;/usr/lib/python2.7/dist-packages&#39;]</pre></td>' +
    '</tr>' +
    '<tr>' +
      '<th>Server time:</th>' +
      '<td>Tue, 14 Jul 2015 20:43:56 +0000</td>' +
    '</tr>' +
  '</table>' +
'</div>' +
'</body>' +
'</html>'
        },
      ];
