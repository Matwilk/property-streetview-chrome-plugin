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
  #street-view {
      width: 100%;
      height: 500px; /* Adjust height as needed */
  }

  .modalContent {
    width: 100%;
    background-color: #fefefe;
    margin: 15% auto;
    border: 1px solid #888;
    height: 60%;
    position: relative;
    overflow: hidden;

    #mapframe {
      padding: 20px;
    }
  }

  .popup-close {
    position: absolute;
    right: 0px;
  }
  
  @media (min-width: 600px) {
    .modalContent {
      width: 600px;
    }
  }
`;

const GOOGLE_API_KEY = 'AIzaSyCo580fBH4USx2s5WWQDh5xGZCNvBC_HeM'; // TODO needs passing in as env var

document.head.appendChild(style);

// Create popup item
const popup = document.createElement("div");
popup.id = 'popup-dialog'
popup.style.cssText = modalStyle
const content = document.createElement("div");
content.className = "modalContent"

popup.appendChild(content)
document.body.appendChild(popup)

// Create the close button
const closeButton = document.createElement('button');
closeButton.className = 'popup-close';
closeButton.textContent = 'Close';
closeButton.addEventListener('click', () => {
  popup.style.display = 'none'
});

const generateGoogleMapEmbedUrl = (coordinates: [number, number]) => {
  if (!coordinates) {
    return undefined
  }

  const baseUrl = "https://www.google.com/maps/embed/v1/streetview"
  const coordinatesString = `${String(coordinates[0])},${String(coordinates[1])}`
  const url = `${baseUrl}?key=${GOOGLE_API_KEY}&location=${coordinatesString}`

  return url
}

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

  // Add an event listener
  clickable.addEventListener("click", async () => {
    try {
      popup.style.display = 'block'
      const response = await fetch(`https://www.rightmove.co.uk/properties/${id}#`)

      if (response.ok) {
        const html = await response.text()
  
        const coordinateRegex = /"latitude":([0-9.-]+),"longitude":([0-9.-]+)/g;
        const match = coordinateRegex.exec(html)
  
        if (match) {
          const latitude = parseFloat(match[1]);
          const longitude = parseFloat(match[2]);
    
          content.innerHTML = `<iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${generateGoogleMapEmbedUrl([latitude, longitude])}"></iframe>`
          content.appendChild(closeButton)
        }
        else {
          console.error('error parsing lat long')
        }
      } else {
        console.log('Error fetching page', response.statusText)
      }
    } catch (err) {
      console.error('Error thrown fetching page', err)
    }
  });

  // Append the clickable item to the listing
  header[0].appendChild(clickable);
});
