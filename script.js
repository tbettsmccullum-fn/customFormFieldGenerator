  /*GlOBAL*/
let formOutput; // Form output container
let htmlOutput; // HTML output container
let submitOutput; // Submit file output container
let inputLength;
let inputLabel;
let copyElements;
let div_beg = '<div class="formfield">';
let div_end = '</div>';
let newline = '\r\n';
let numFields = 0;

$( document ).ready(function() {
  
    formOutput = $("#form"); // Form output container
    htmlOutput = $("#html-output"); // HTML output container
    submitOutput = $("#submit-output"); // Submit file output container
    inputLength =  $("#input-length");
    inputLabel = $("#input-length-label");
    copyElements = $("#copy");

    /*EVENT LISTENERS*/
    $("#input").submit((e) => {
        e.preventDefault(); 
        let required = e.target[1].checked; 
        let maxlength = e.target[2].value; 
        let type = e.target[3].value; 
        let title = e.target[4].value.trim(); 
        let name = e.target[5].value.trim();
        createInput(required,maxlength,type,title,name);
        createOneLineSubmit(title,name);
        numFields += 1;
        e.target.reset();
        inputLength.show();
        inputLabel.hide();
    });

    $("#textarea").submit((e) => {
        e.preventDefault(); 
        let required = e.target[1].checked; 
        let title = e.target[2].value.trim(); 
        let name = e.target[3].value.trim();
        createTextArea(required,title,name);
        createTwoLineSubmit(title,name); 
        numFields += 1;
        e.target.reset();
    });

    $("#select").submit((e) => {
        e.preventDefault(); 
        let required = e.target[1].checked; 
        let title = e.target[2].value.trim(); 
        let name = e.target[3].value.trim();
        let numOptions = e.target[4].value;
        createSelect(required,title,name,numOptions);
        createOneLineSubmit(title,name); 
        numFields += 1;
        e.target.reset();
    });

    $("#radio").submit((e) => {
        e.preventDefault(); 
        let required = e.target[1].checked; 
        let title = e.target[2].value.trim();
        let name = e.target[3].value.trim(); 
        let numOptions = e.target[4].value;
        createRadioButtons(required,title,name,numOptions);
        createOneLineSubmit(title,name); 
        numFields += 1;
        e.target.reset();
    });

    $("#checkbox").submit((e) => {
        e.preventDefault(); 
        let required = e.target[1].checked; 
        let title = e.target[2].value.trim();
        let name = e.target[3].value.trim(); 
        let numOptions = e.target[4].value;
        createCheckboxes(required,title,name,numOptions);
        for (let i = 0; i < numOptions; i++) { 
            createOneLineSubmit("X",name + "_" + i);
        }
        numFields += 1;
        e.target.reset();
    });

    $("#input-type").change((e) => {
        if (e.target.value == "date" || e.target.value == "number") {
            inputLength.hide();
            inputLabel.hide();
        } else{
            inputLength.show();
            inputLabel.show();
        }
    });

    $(".copy").click((e) => { 
        navigator.clipboard.writeText(e.target.textContent);
    });

    $('#form').on('click', '.custom_field_delete', (e) => {
        fieldName = e.target.id;
        $('.' + fieldName).remove()
    })

    $("#clear-all").click((e) => { 
        formOutput.empty();
        htmlOutput.text('');
        submitOutput.text('');
    });
  
});


/*FUNCTIONS*/

// Handle tab click
function clickTab(e, tabID) {
  let i, tabcontent, tabs;

  // clear the previous content
  tabcontent = $(".content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("visible");
  }

  // set "active class"
  tabs = $(".tab");
  for (i = 0; i < tabs.length; i++) {
    tabs[i].className = tabs[i].className.replace(" active", "");
  }

  // display new tab
  $(tabID)[0].classList.add("visible");
  e.currentTarget.className += " active";
}

// Return a Single Line Submit File line
function createOneLineSubmit(title,name){
    let preBlock = document.createElement("pre")
    preBlock.setAttribute("class", 'custom_field_'+numFields);

    let codeBlock = document.createElement("code")
    codeBlock.append(`mail.Body += "${title}: " + Request.Form["${name}"] + Environment.NewLine;`);
    codeBlock.append('\r\n'); 

    preBlock.append(codeBlock);
    submitOutput.append(preBlock)
}

// Return a Two Line Submit File line
function createTwoLineSubmit(title,name){    
    let preBlock = document.createElement("pre")
    preBlock.setAttribute("class", 'custom_field_'+numFields);

    let codeBlock = document.createElement("code")
    codeBlock.append(`mail.Body += "${title}: " + Environment.NewLine;`);
    codeBlock.append('\r\n'); 
    codeBlock.append(`mail.Body += Request.Form["${name}"] + Environment.NewLine + Environment.NewLine;`);
    codeBlock.append('\r\n'); 

    preBlock.append(codeBlock);
    submitOutput.append(preBlock)
}

// Make an element required 
function makeRequired(element,label){
    // set element to be required 
    element.setAttribute("required", "required"); 

    // create required label
    let req = document.createElement("abbr");
    req.classList.add("req");
    req.setAttribute("title", "required");
    req.append("*");

    // append required label
    label.append(req); 
}

// Returns an HTML code block with unique id 
function createFieldHTML(codeContent){
    let codeBlock = document.createElement("pre")
    codeBlock.setAttribute("class", 'custom_field_'+numFields);
    
    let code = document.createElement("code")
    code.append(codeContent);  

    codeBlock.append(code); 

    return codeBlock;
}

function createFormField(div){
    let outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", 'custom_field_'+numFields);

    let deleteBtn = document.createElement("button")
    deleteBtn.append('Delete');
    deleteBtn.setAttribute("id",'custom_field_'+numFields);
    deleteBtn.setAttribute("class", 'custom_field_delete');

    outerDiv.append(deleteBtn);
    outerDiv.append(div);

    return outerDiv;
}

// Create an input field
function createInput(required,maxlength,type,title,name){
    // create outer div
    let div = document.createElement("div");
    div.classList.add("formfield");

    // create label
    let label = document.createElement("label");
    label.classList.add("formheader");
    label.append(title + ": ");
    label.setAttribute("for", name);

    // create input
    let input = document.createElement("input"); 
    if (type != "date" && type != "number") input.setAttribute("maxlength", maxlength); // set maxlength if not a date or number type
    input.setAttribute("id", name);
    input.setAttribute("name", name);
    input.setAttribute("size", "30");
    input.setAttribute("title", title);
    input.setAttribute("type", type);

    // check required
    if (required) makeRequired(input,label); 

    // append complete form field
    div.append(label,input); 
    formOutput.append(createFormField(div)); 

    // append complete html block
    let htmlBlock = div_beg + newline + label.outerHTML + newline + input.outerHTML + newline + div_end + newline;
    htmlOutput.append(createFieldHTML(htmlBlock)); 
}

// Create a textarea
function createTextArea(required,title,name){
    // create outer div
    let div = document.createElement("div"); 
    div.classList.add("formfield", "formblock");

    // create label
    let label = document.createElement("label");
    label.classList.add("formheader");
    label.append(title + ": ");
    label.setAttribute("for", name);

    // create textarea 
    let ta = document.createElement("textarea"); 
    ta.setAttribute("cols", "30");
    ta.setAttribute("rows", "5");
    ta.setAttribute("style", "width: 100%;");
    ta.setAttribute("id", name);
    ta.setAttribute("name", name);
    
    // check required
    if (required) makeRequired(ta,label);

    // append complete form field
    div.append(label,ta); 
    formOutput.append(createFormField(div)); 

    // append complete html block
    let htmlBlock = div_beg + newline + label.outerHTML + newline + ta.outerHTML + newline + div_end + newline;
    htmlOutput.append(createFieldHTML(htmlBlock));
}

 // Create Select with empty options
function createSelect(required,title,name,numOptions){
    // create outer div
    let div = document.createElement("div"); 
    div.classList.add("formfield");

    // create label
    let label = document.createElement("label"); 
    label.classList.add("formheader");
    label.append(title + ": ");

    // create select
    let select= document.createElement("select");
    select.setAttribute("id", name);
    select.setAttribute("name", name);
    select.setAttribute("title", title);

    // check required
    if (required) makeRequired(select,label);

    // append beginning of div, label, and beginning of select tag to html
    let select_beg = select.outerHTML.substring(0, select.outerHTML.length - 9);
    let htmlBlock = div_beg + newline + label.outerHTML + newline + select_beg + newline;

    // create first option 
    let option1 = document.createElement("option"); 
    option1.append("--- Please Select One ---");
    option1.setAttribute("selected","selected")
    option1.setAttribute("disabled","disabled")
    select.append(option1);

    // append first option to html
    htmlBlock += option1.outerHTML+ newline; 

    // create the rest of the options 
    for (let i = 0; i < numOptions; i++) { 
        let option = document.createElement("option"); // create option 
        option.append("X");
        option.setAttribute("value", "X");

        select.append(option); // append each option the the select

        htmlBlock += option.outerHTML+ newline; // append each option to html
    }

    // append complete form field to form
    div.append(label,select); 
    formOutput.append(createFormField(div));

    // append select ending tag to html, append complete html block
    htmlBlock += "</select>" + newline + div_end + newline; 
    htmlOutput.append(createFieldHTML(htmlBlock));
}

// Create Radio Buttons with empty options
function createRadioButtons(required,title,name,numOptions){
    // create outer div
    let div = document.createElement("div"); 
    div.classList.add("formfield");

    // create label
    let label = document.createElement("label"); 
    label.classList.add("formheader");
    label.append(title + ": ");

    // check required
    if (required){  
        let req = document.createElement("abbr"); // create required tag
        req.classList.add("req");
        req.setAttribute("title", "required");
        req.append("*");
        label.append(req); // append required label
    }
    div.append(label); 

    // append div and label to html
    let htmlBlock = div_beg + newline + label.outerHTML + newline;

    // create radio buttons 
    for (let i = 0; i < numOptions; i++) { 
        let optionInput = document.createElement("input"); // create radio button input 
        optionInput.setAttribute("id", name + "_" + i); 
        optionInput.setAttribute("name", name);
        optionInput.setAttribute("type", "radio");
        optionInput.setAttribute("value", "X");

        // if required and if this is the first option
        if (required && i == 0) {
            optionInput.setAttribute("required", "required"); // set that option to be required 
        }

        // create radio button label
        let optionLabel = document.createElement("label"); 
        optionLabel.classList.add("inlinelabel");
        optionLabel.setAttribute("for", name + "_" + i); 
        optionLabel.append("X");

        // append option and label to form
        div.append(optionInput); 
        div.insertAdjacentHTML("beforeend"," ");
        div.append(optionLabel);

        // append current radio button and label to html
        htmlBlock += optionInput.outerHTML + " " + optionLabel.outerHTML+ newline; 
    }
    // append complete form field to form 
    formOutput.append(createFormField(div)); 

    // append end of div to html, append complete html block
    htmlBlock += div_end + newline; 
    htmlOutput.append(createFieldHTML(htmlBlock));
}

// Create Group of Checkboxes
function createCheckboxes(required,title,name,numOptions){
    // create outer div
    let div = document.createElement("div");
    div.classList.add("formfield");

    // create label
    let label = document.createElement("label");
    label.classList.add("formheader");
    label.append(title + ": ");
    label.setAttribute("for", name);

    // create break element 
    let linebreak = document.createElement("br"); 

    // check required
    if (required) {
         // create required label
        let req = document.createElement("abbr");
        req.classList.add("req");
        req.setAttribute("title", "required");
        req.append("*");

        // append required label
        label.append(req); 
    }; 
    div.append(label,linebreak); 

    // append to html
    let htmlBlock = div_beg + newline + label.outerHTML + newline;

    // create checkboxes
    for (let i = 0; i < numOptions; i++) { 

        let input = document.createElement("input"); //create checkbox
        input.setAttribute("id", name + "_" + i);
        input.setAttribute("name", name + "_" + i);
        input.setAttribute("value", "X");
        input.setAttribute("type", "checkbox");

        let label = document.createElement("label");  // create checkbox label
        label.classList.add("inlinelabel");
        label.append("X");
        label.setAttribute("for", name + "_" + i);

        let linebreak = document.createElement("br"); // create break element

        // append option and label to form
        div.append(input); 
        div.insertAdjacentHTML("beforeend"," ");
        div.append(label,linebreak); 

        // append each checkbox to html 
        htmlBlock += input.outerHTML + " " + label.outerHTML + linebreak.outerHTML + newline;
    } 

    // append complete form field 
    formOutput.append(createFormField(div)); 

    // append end of div to html, append complete html block
    htmlBlock += div_end + newline;
    htmlOutput.append(createFieldHTML(htmlBlock));
}