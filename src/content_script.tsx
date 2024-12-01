const listings = document.querySelectorAll(".propertyCard-header");

const style = `
  background: url(https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons@master/svg/google-maps.svg) no-repeat center / contain;
  height:30px;
  width:30px;
  background-size: 60%
`

// Add a clickable item to each listing
listings.forEach((listing, index) => {
    // Create a new clickable item
    const clickable = document.createElement("div");
    clickable.style.cssText = style
    
    clickable.style.cursor = "pointer";

    // Add an event listener
    clickable.addEventListener("click", () => {
        alert(`You clicked item ${index + 1}`);
    });

    // Append the clickable item to the listing
    listing.appendChild(clickable);
});
