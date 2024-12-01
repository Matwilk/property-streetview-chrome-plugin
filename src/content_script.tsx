const listings = document.querySelectorAll(".propertyCard");

const style = `
  background: url(https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons@master/svg/google-maps.svg) no-repeat center / contain;
  height:30px;
  width:30px;
  background-size: 60%
`

// Add clickable Street View icon to each listing
listings.forEach((listing, index) => {
  const anchor = listing.getElementsByClassName('propertyCard-anchor')
  const wrapper = listing.getElementsByClassName('propertyCard-wrapper')
  const header = wrapper[0].getElementsByClassName('propertyCard-header')
  const id = anchor[0].id.slice(4);

  // Create a new clickable item
  const clickable = document.createElement("div");
  clickable.style.cssText = style
  
  clickable.style.cursor = "pointer";

  // Add an event listener
  clickable.addEventListener("click", () => {
      alert(`You clicked item ${id}`);
  });

  // Append the clickable item to the listing
  header[0].appendChild(clickable);
});
