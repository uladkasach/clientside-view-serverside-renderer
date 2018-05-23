var view_loader = require("clientside-view-loader");
function append_ids_based_on_urls(structure){
    // if this structure is an array, parse each part of it recursivly
    var is_array = Array.isArray(structure);
    if(is_array) return structure.forEach((structure)=>{append_ids_based_on_urls(structure)}); // for each element recursivly handle it

    // if the structure is not an array, then append an 'id' based on either the 'url', 'text', or 'html', in that order of precedence; dont overwrite id if given
    if(typeof structure.id == "undefined" && typeof structure.src == "string") structure.id = "header-" + structure.src;
    if(typeof structure.id == "undefined" && typeof structure.text == "string") structure.id = "header-" + structure.text;
    if(typeof structure.id == "undefined" && typeof structure.html == "string") structure.id = "header-" + window.btoa(structure.html); // base64 encode html to make the id not look weird

    // if the 'elements' property is defined, parse it recursivly
    if(typeof structure.elements == "object") append_ids_based_on_urls(structure.elements);
}
module.exports = (async function(){
     var structure = (require("./header_structure.json"))
     append_ids_based_on_urls(structure["left"]);
     append_ids_based_on_urls(structure["right"]);
     var build_options = {
        structure : structure,
        style : {
            element_min_width : 180,
            element_min_width : 140
        }
    }
    var dom = await view_loader.load("clientside-view-responsive-header").build(build_options, "server");
    return dom;
})()
