const fileInput = document.querySelector(".file-input");
const previewImage = document.querySelector(".image-preview img");
const filterOption = document.querySelectorAll(".filters button");
const rotateOption = document.querySelectorAll(".rotate button");
const filterName = document.querySelector(".slider-info .name");
const filterValue = document.querySelector(".slider-info .value");
const filterSlider = document.querySelector(".slider input");
const chooseImgBtn = document.querySelector(".choose-image");
const resetFilterBtn = document.querySelector(".reset-filters");
const saveImageBtn = document.querySelector(".save-image");

let brightness = 100, saturation = 100, invertion = 0, greyscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
const applyFilters = () =>{
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${invertion}%) grayscale(${greyscale}%)`
}
const loadImage =()=>{
   let file = fileInput.files[0]; //getting user selected files
   if(!file)return; // return if user hasn't selected file
    previewImage.src = URL.createObjectURL(file); // passing file url as preview img src
    previewImage.addEventListener("load", ()=>{
        resetFilterBtn.click(); //clicking reset btn so the filter value reset if the user select new img
        document.querySelector(".container").classList.remove("disable");
    });
} 

filterOption.forEach(option => {
    option.addEventListener("click", () =>{
        document.querySelector(".filters .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`
        }else if (option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        }else if (option.id === "invertion"){
            filterSlider.max = "100";
            filterSlider.value = invertion;
            filterValue.innerText = `${invertion}%`
        }else{
            filterSlider.max = "100";
            filterSlider.value = greyscale;
            filterValue.innerText = `${greyscale}%`
        }
    });
    // console.log(option);
});

const updateFilter = () =>{
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filters .active");

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }else if(selectedFilter.id === "invertion"){
        invertion = filterSlider.value;
    }else{
        greyscale = filterSlider.value;
    }
    applyFilters();
}

rotateOption.forEach(option =>{
    option.addEventListener("click", ()=>{
        if(option.id === "left"){
            rotate -=90; // if clicked btn is left decreament rotate value by -90
        }else if (option.id === "right"){
            rotate -= 90;
        }else if (option.id === "horizontal"){
            //if flip horizontal value is 1, set this value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else{
            //if flip vertical value is 1, set this value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

const resetFilter = ()=>{
    // resetting all the filter values
    brightness = 100; saturation = 100; invertion = 0; greyscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOption[0].click(); // selecting brightness btn, selected by default
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHieght;

    //applying selected filter to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${invertion}%) grayscale(${greyscale}%)`;
    ctx.translate(canvas.width/2, canvas.height/2); // transleting canvas from center
    if(rotate !== 0){ // rotate if value isn't 0, rotate the canvas
        ctx.rotate(rotate* Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical); // flip canvas, horizontally / vertically 
    ctx.drawImage(previewImage, canvas.width/2, canvas.height/2, canvas.width, canvas.height);

    const link = document.createElement("a") // creating <a> element
    link.download = "image.jpg"; //passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
    link.click(); //clicking <a> tag so the image download
}
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImageBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", ()=>fileInput.click());


