var template_path = Qva.Remote + "?public=only&name=Extensions/template/";
function extension_Init()
{
	// Use QlikView's method of loading other files needed by an extension. These files should be added to your extension .zip file (.qar)
	if (typeof jQuery == 'undefined') {
	    Qva.LoadScript(template_path + 'jquery.js', extension_Done);
	}
	else {
	    extension_Done();
	}        
    
    //If more than one script is needed you can nest the calls to get them loaded in the correct order
    //Qva.LoadScript(template_path + "file1.js", function() {
    //Qva.LoadScript(template_path + "file2.js", extension_Done);
    //});

}
if (Qva.Mgr.mySelect == undefined) {
    Qva.Mgr.mySelect = function (owner, elem, name, prefix) {
        if (!Qva.MgrSplit(this, name, prefix)) return;
        owner.AddManager(this);
        this.Element = elem;
        this.ByValue = true;
 
        elem.binderid = owner.binderid;
        elem.Name = this.Name;
 
        elem.onchange = Qva.Mgr.mySelect.OnChange;
        elem.onclick = Qva.CancelBubble;
    }
    Qva.Mgr.mySelect.OnChange = function () {
        var binder = Qva.GetBinder(this.binderid);
        if (!binder.Enabled) return;
        if (this.selectedIndex < 0) return;
        var opt = this.options[this.selectedIndex];
        binder.Set(this.Name, 'text', opt.value, true);
    }
    Qva.Mgr.mySelect.prototype.Paint = function (mode, node) {
        this.Touched = true;
        var element = this.Element;
        var currentValue = node.getAttribute("value");
        if (currentValue == null) currentValue = "";
        var optlen = element.options.length;
        element.disabled = mode != 'e';
        //element.value = currentValue;
        for (var ix = 0; ix < optlen; ++ix) {
            if (element.options[ix].value === currentValue) {
                element.selectedIndex = ix;
            }
        }
        element.style.display = Qva.MgrGetDisplayFromMode(this, mode);
 
    }
}
function extension_Done(){
	//Add extension
	Qva.AddExtension('template', function(){
		//Load a CSS style sheet
		Qva.LoadCSS(template_path + "style.css");
		var _this = this;
		//get first text box
		var text1 = _this.Layout.Text0.text.toString();
		//get check box value
		var checkbox1 = _this.Layout.Text1.text.toString();
		var select = _this.Layout.Text2.text.toString();
		//add a unique name to the extension in order to prevent conflicts with other extensions.
		//basically, take the object ID and add it to a DIV
		var divName = _this.Layout.ObjectId.replace("\\", "_");
		if(_this.Element.children.length == 0) {//if this div doesn't already exist, create a unique div with the divName
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
		} else {
			//if it does exist, empty the div so we can fill it again
			$("#" + divName).empty();
		}
		//create a variable to put the html into
		var html = "";
		//set a variable to the dataset to make things easier 
		var td = _this.Data;
		//add the text variables to the html variable
		html += "Text1: " + text1 + "<br /> checkbox1 value: " + checkbox1 + "<br />Data Length: " + td.Rows.length + " rows<br />SELECT " + select + "<br />";
		//loop through the data set and add the values to the html variable
		for(var rowIx = 0; rowIx < td.Rows.length; rowIx++) {
			//set the current row to a variable
			var row = td.Rows[rowIx];
			//get the value of the first item in the dataset row
			var val1 = row[0].text;
			//get the value of the second item in the dataset row
			var val2 = row[1].text;
			//get the value of the measurement in the dataset row
			var m = row[2].text;
			//add those values to the html variable
			html += "value 1: " + val1 + " value 2: " + val2 + " expression value: " + m + "<br />";
		}
		//html = "<img src='https://dl.dropbox.com/u/24965329/deal_slide.gif'/>"; 
		//insert the html from the html variable into the extension.
	    $("#" + divName).html(html);
	    
	    
	});
}
//Initiate extension
extension_Init();

