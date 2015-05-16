/**
 * webistor_panel namespace.
 */
if ("undefined" == typeof(webistor_panel)) {
  var webistor_panel = {};
};

webistor_panel.sibPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
webistor_panel.previousUnreadMails = 0;

webistor_panel.BrowserOverlay = {

	resizePanel: function(){ //resize the panel with the preference %.
		var panelWidth = webistor_panel.sibPref.getIntPref("extensions.webistor_panel.panelWidth")/100;
		var panelHeight = webistor_panel.sibPref.getIntPref("extensions.webistor_panel.panelHeight")/100;
		var panel = document.getElementById("webistor_panel-panel");
		panel.sizeTo(window.screen.availWidth*panelWidth,window.screen.availHeight*panelHeight);
	},
  
  showWebistorPopup: function (unreadMails){
    
    var gpStringsBundle = document.getElementById("webistor_panel-string-bundle");    
    
    var popupService = Components.classes['@mozilla.org/alerts-service;1'].getService(Components.interfaces.nsIAlertsService);
    
    popupService.showAlertNotification(
      "chrome://webistor_panel/content/webistor-48.png", //AString imageUrl
      '', //AString title
      '', //AString text
      false, //boolean textClickable
      "", //AString cookie
      null, //nsIObserver alertListener
      "" //AString name
    );
  },
  
  setWebistorIcon: function (){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);

    var webistorButton = mainWindow.document.getElementById("webistor_panel-toolbar-button");
    var WebistorIframeContent = mainWindow.document.getElementById("webistor_panel-iframe").contentDocument;
    
    try{
      var faviconURL = WebistorIframeContent.getElementsByTagName('link')[1].href;
      if ((faviconURL.search("favicon.ico") > -1)){ //If it = -1 means that its a non valid image.
        webistorButton.setAttribute("image",faviconURL);
      } else {
        webistorButton.setAttribute("image","chrome://webistor_panel/content/favicon.png");
      };
    }catch(e){
      webistorButton.setAttribute("image","chrome://webistor_panel/content/favicon.png");
    };
  },
  
  setWebistorIframe: function (iframe_url){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var WebistorIframe = mainWindow.document.getElementById("webistor_panel-iframe");
		WebistorIframe.webNavigation.loadURI(iframe_url,'LOAD_FLAGS_NONE',null,null,null);
        
  },
  
  checkIframe: function(){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var WebistorIframe = mainWindow.document.getElementById("webistor_panel-iframe");
    if(WebistorIframe.webNavigation.currentURI.spec == "chrome://webistor_panel/content/gp-loading.xul"){ 
      //If the user opens the panel before it is loaded for the first time, I load it.
      //If it's loaded, I do nothing, because it's pretty annoying loading every time you open the panel because the load has a little delay. 
      //Also, you might lose information.
      webistor_panel.BrowserOverlay.setWebistorIframe('https://webistor.net');
    };
  },
  
  checkMail: function (){ //Check the mails and refresh the button's image with de Webistor's favicon.
    webistor_panel.BrowserOverlay.checkIframe();
    try{
      window.clearTimeout(webistor_panel.checkMailTimeOut);
    }catch(e){
      //Do nothing. Because in the first Run isn't defined the timeout.
    };

    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);

    var WebistorIframeContent = mainWindow.document.getElementById("webistor_panel-iframe").contentDocument;
		
    //If you are not logged, set the default icon.
    var button = document.getElementById("webistor_panel-toolbar-button");
    button.setAttribute("image","chrome://webistor_panel/content/favicon.png");

  },

  pinWebistorPanel: function (){
    var panel = document.getElementById("webistor_panel-panel");
    var noautohide = webistor_panel.sibPref.getBoolPref("extensions.webistor_panel.noautohide");
    panel.setAttribute("noautohide", noautohide);
    var pinButton = document.getElementById("webistor_panel-toolbarButton_pin");
    pinButton.checked = noautohide;
  },
  
  changePinMode: function (){
    var pinMode = document.getElementById("webistor_panel-toolbarButton_pin").checked;
    webistor_panel.sibPref.setBoolPref("extensions.webistor_panel.noautohide", pinMode);
    webistor_panel.BrowserOverlay.pinWebistorPanel();
    //Need to close and reopen the panel to make the change take effect.
    var panel = document.getElementById("webistor_panel-panel");
    panel.hidePopup();
    var button = document.getElementById("webistor_panel-toolbar-button");
    panel.openPopup(button, "", 0, 0, false, false);
  },
  
  autoHideToolbar: function (){
    var panelToolbar = document.getElementById("webistor_panel-panel-toolbar");
    var toolbarAutoHide = webistor_panel.sibPref.getBoolPref("extensions.webistor_panel.toolbarAutoHide");
    if(toolbarAutoHide){
      panelToolbar.classList.add("webistor_panel-toolbar-class-hide");
      panelToolbar.classList.remove("webistor_panel-toolbar-class-show");
      
    }else{
      panelToolbar.classList.add("webistor_panel-toolbar-class-show");
      panelToolbar.classList.remove("webistor_panel-toolbar-class-hide");
    };
    var autoHideButton = document.getElementById("webistor_panel-toolbarButton_autoHide");
    autoHideButton.checked = toolbarAutoHide;
  },
  
  changeAutoHideMode: function (){
    var pinMode = document.getElementById("webistor_panel-toolbarButton_autoHide").checked;
    webistor_panel.sibPref.setBoolPref("extensions.webistor_panel.toolbarAutoHide", pinMode);
    webistor_panel.BrowserOverlay.autoHideToolbar();
    //Need to close and reopen the panel to make the change take effect.
    var panel = document.getElementById("webistor_panel-panel");
    panel.hidePopup();
    var button = document.getElementById("webistor_panel-toolbar-button");
    panel.openPopup(button, "", 0, 0, false, false);
  },
  
  goBack: function (){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var WebistorIframe = mainWindow.document.getElementById("webistor_panel-iframe");
    if(WebistorIframe.webNavigation.canGoBack){
      WebistorIframe.webNavigation.goBack();
    }else{
      var gpStringsBundle = document.getElementById("webistor_panel-string-bundle");    
      var cantGoBack = gpStringsBundle.getString('cantGoBack');
      alert(cantGoBack);
    };
  },
  
  goForward: function (){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var WebistorIframe = mainWindow.document.getElementById("webistor_panel-iframe");
    if(WebistorIframe.webNavigation.canGoForward){
      WebistorIframe.webNavigation.goForward();
    }else{
      var gpStringsBundle = document.getElementById("webistor_panel-string-bundle");    
      var cantGoForward = gpStringsBundle.getString('cantGoForward');
      alert(cantGoForward);
    };
  },
  
  openWebistorPanel: function (){
	  window.clearTimeout(webistor_panel.delayFirstRunTimeOut);
    
    webistor_panel.BrowserOverlay.resizePanel();
    webistor_panel.BrowserOverlay.checkIframe();
    webistor_panel.BrowserOverlay.setWebistorIcon();
    webistor_panel.BrowserOverlay.pinWebistorPanel();
    webistor_panel.BrowserOverlay.autoHideToolbar();
    window.clearTimeout(webistor_panel.checkMailTimeOut);
    
	},
  
  closeWebistorPanel: function (){
    webistor_panel.BrowserOverlay.setWebistorIcon();
  },
  
  installButton: function(toolbarId, id){
    if (!document.getElementById(id)){
      var toolbar = document.getElementById(toolbarId);
      var before = null;
      toolbar.insertItem(id, before);
      toolbar.setAttribute("currentset", toolbar.currentSet);
      document.persist(toolbar.id, "currentset");
    };
  },
  
  gpShortcut_cmd: function(){ //opens the panel with the shortcut.
    var panel = document.getElementById("webistor_panel-panel");
    var button = document.getElementById("webistor_panel-toolbar-button");
    if(panel.state == "closed"){
      panel.openPopup(button, "", 0, 0, false, false);
    }else{
      panel.hidePopup();
    };
  },
  
  add: function(){
    var url = gBrowser.contentDocument.location;
    var title = gBrowser.contentDocument.title;
    var panel = document.getElementById("webistor_panel-panel");
    var button = document.getElementById("webistor_panel-toolbar-button");
    webistor_panel.BrowserOverlay.setWebistorIframe('chrome://webistor_panel/content/gp-loading.xul');
    var add_timeout = setTimeout(
      function() {webistor_panel.BrowserOverlay.setWebistorIframe("https://webistor.net/add?title="+encodeURIComponent(title)+"&url="+encodeURIComponent(url));},
      1* 
      10
    ); 
    panel.openPopup(button, "", 0, 0, false, false);
  },
  
  onclick: function(event){
    switch(event.button) {
      case 0:
        // Left click
        break;
      case 1:
        // Middle click: reload Webistor frame
        webistor_panel.BrowserOverlay.setWebistorIframe('https://webistor.net');
        break;
      case 2:
        // Right click
        break;
    };
  },
  
  initKeyset: function(){ //On Firefox loads sets the shortcut keys.
    var modifiers = webistor_panel.sibPref.getCharPref("extensions.webistor_panel.modfiers");
    var key = webistor_panel.sibPref.getCharPref("extensions.webistor_panel.key");
    var keyset = document.getElementById("webistor_panel-shortcut_cmd");
    keyset.setAttribute("modifiers",modifiers);
    keyset.setAttribute("key",key);
  },
  
  onFirefoxLoad: function(event){
    window.removeEventListener("load", function () { webistor_panel.BrowserOverlay.onFirefoxLoad(); }, false);
    var isFirstRunPref = webistor_panel.sibPref.getBoolPref("extensions.webistor_panel.isFirstRun");
    if (isFirstRunPref){
      webistor_panel.BrowserOverlay.installButton("nav-bar", "webistor_panel-toolbar-button");
      webistor_panel.sibPref.setBoolPref("extensions.webistor_panel.isFirstRun", false);
    };
    this.initKeyset(); //initiate the button's keyboard shortcut.
  },

};

window.addEventListener("load", function () { webistor_panel.BrowserOverlay.onFirefoxLoad(); }, false);

//Delay the first iframe load.
webistor_panel.delayFirstRunTimeOut = setTimeout(
    function() {
      webistor_panel.BrowserOverlay.setWebistorIframe('http://mail.google.com');
      var button = document.getElementById("webistor_panel-toolbar-button");
      // button.setAttribute("image","chrome://webistor_panel/content/loading.gif");
      webistor_panel.BrowserOverlay.checkMail();
    },
    webistor_panel.sibPref.getIntPref("extensions.webistor_panel.delayFirstRun")*
    1000
);
