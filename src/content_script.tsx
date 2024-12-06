const listings = document.querySelectorAll(".propertyCard");

const clickableStyle = `
  background: url(https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons@master/svg/google-maps.svg) no-repeat center / contain;
  height:30px;
  width:30px;
  background-size: 60%
`

const modalStyle = `
  display: none;
  position: fixed;
  z-index: 20;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
`

const modalContentStyle = 
`
  background-color: #fefefe;
  margin: 15% auto;
  border: 1px solid #888;
  width: 100%;
  height: 60%;
  position: relative;
  overflow: hidden;
`

const style = document.createElement('style');
style.type = 'text/css';

// Add responsive CSS rules
style.innerHTML = `
  .modalContent {
    width: 100%;
    background-color: #fefefe;
    margin: 15% auto;
    border: 1px solid #888;
    height: 60%;
    position: relative;
    overflow: hidden;
  }
  
  @media (min-width: 600px) {
    .modalContent {
      width: 600px;
    }
  }
`;

// Append the <style> element to the <head>
document.head.appendChild(style);

// Add clickable Street View icon and popup to each listing
listings.forEach((listing, index) => {
  const anchor = listing.getElementsByClassName('propertyCard-anchor')
  const wrapper = listing.getElementsByClassName('propertyCard-wrapper')
  const header = wrapper[0].getElementsByClassName('propertyCard-header')
  const id = anchor[0].id.slice(4);

  // Create clickable item
  const clickable = document.createElement("div");
  clickable.style.cssText = clickableStyle
  clickable.style.cursor = "pointer";

  // Create popup item
  const popup = document.createElement("div");
  popup.id = `popup-${id}`
  popup.style.cssText = modalStyle
  const content = document.createElement("div");
  content.className = "modalContent"

  content.innerHTML = `<iframe id="mapframe" src="https://www.rightmove.co.uk/properties/${id}#/streetView?channel=RES_BUY" width="100%" height="450" style="border:0;position:absolute;top:-40px" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  popup.appendChild(content)
  listing.appendChild(popup)

  // Add an event listener
  clickable.addEventListener("click", () => {
    popup.style.display = 'block'
  });

  // Append the clickable item to the listing
  header[0].appendChild(clickable);
});
