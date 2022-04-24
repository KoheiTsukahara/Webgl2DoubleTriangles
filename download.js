let btn = document.getElementById("btn-get-image");
btn.addEventListener('click',()=>{
    let canvas = document.getElementById("canvas");
    // let type = 'image/png';
    let link = document.createElement("a");
    link.href= canvas.toDataURL();
    link.download = "test.png";
    link.click();

});