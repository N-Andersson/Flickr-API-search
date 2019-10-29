/* 
Key: 236225ca659be5ceeb9e3b3d71a8d815
Secret: d59c87777c074514
*/


// addingImages ensures that getFlickrData() isn't called multiple times.
var addingImages = false;
var pageNbr = 1;


/*
Takes the input from the search field and performs a search of the entered tags.
Clears the div, the pageNbr and performs a new search
*/
function searchTag() {
    pageNbr = 1;
    document.getElementById("galleryContainer").innerHTML = "";
    tag = document.getElementById("myText").value;

    getFlickrData();
}

async function getFlickrData() {
    addingImages = true;
    /*
    Performs a search of images with the chosen tag and
    retrieves information from the search needed to find the image source
    */
    const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=236225ca659be5ceeb9e3b3d71a8d815&tags=" + tag + "&privacy_filter=1&format=json&nojsoncallback=1&page=" + pageNbr;
    try {
        var response = await fetch(url);
        var data = await response.json();
        var photos = data.photos.photo;

        //Creating individual page-divs to contain the photos from each page in the results.
        var galleryPage = document.createElement("div");
        galleryPage.id = "page" + pageNbr;
        galleryPage.className = "pages";
        document.getElementById("galleryContainer").appendChild(galleryPage);

        /* 
        Loops through the photo information retreived for a page and fetches the photo source URLs.
        Creates images with the src to the photo and appends it to the page-div. 
        */
        for (var i = 0; i < photos.length; i++) {
            var img = document.createElement("img");
            currPhoto = photos[i];
            img.src = "https://farm" + currPhoto.farm + ".staticflickr.com/" + currPhoto.server + "/" + currPhoto.id + "_" + currPhoto.secret + "_c.jpg"

            //The image title is retreived and added as a paragraph.
            var imgText = document.createElement("P");
            imgText.innerHTML = photos[i].title;

            //The image + paragraph is wrapped in a div.
            var imgContainer = document.createElement("div");
            imgContainer.className = "imgContainer";
            imgContainer.id = photos[i].id;

            document.getElementById(galleryPage.id).appendChild(imgContainer)
            document.getElementById(imgContainer.id).appendChild(img);

            if (!imgText.innerHTML == "") {
                document.getElementById(imgContainer.id).appendChild(imgText);
            }

        };
    } catch (e) {
        alert("Whops! Something went wrong: " + e.message + "\nPlease try again with another search")
    }

    //Appends a page divider after each gallery page as long as the page is not empty.
    if (!document.getElementById("galleryContainer").innerHTML == "") {
        pageNbr++;
        var pageDivider = document.createElement("P");
        pageDivider.innerHTML = "Page " + pageNbr;
        pageDivider.className = "divider";
        document.getElementById("galleryContainer").appendChild(pageDivider);
    }
    addingImages = false;
}

/*  
Checks how far the user has scrolled and calls for another 
page gallery if the user is close to the bottom. 

The while loop and the boolean was added to ensure that only one page is 
being added at one time while getFlickrData() is running. 
*/
window.onscroll = function () {
    infiniteScroll()
}
function infiniteScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            while (addingImages == false) {
                getFlickrData();
            }
      };

}

