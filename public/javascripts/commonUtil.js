function getUrlParam(key) {
   var sUrl = window.location.href;
   if (sUrl.indexOf("?")) {
	  var hashes = sUrl.slice(sUrl.indexOf('?') + 1).split('&');
	  if (hashes.length > 0) {
	  	for (var i = 0; i < hashes.length; i++) {
	  		var hash = hashes[i].split('=');
	  		if (hash[0] == key) {
	  			return hash[1];
	  		}
	  	}
	  }
   }
   return null;
};

function setSelectedNavItem(selectedId) {
	var navItems = $("#navBar").children();
	$.each(navItems, function(index, item) {
		 if (item.id == selectedId) {
		    $(item).addClass("active");	 
		 } else {
			 $(item).removeClass("active"); 
		 }
	  }
	);
	
};

var EventUtil = 
{
   addHandler: function (element, type, handler) {
      if (element.addEventListener) {
         element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
         element.attachEvent("on"+ type, handler);
      } else {
         element["on" + type] = handler;         
      }
   },
   removeHandler: function (element, type, handler) {
      if (element.removeEventListener) {
         element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
         element.detachEvent("on"+ type, handler);
      } else {
         element["on" + type] = null;         
      }
   }
};
