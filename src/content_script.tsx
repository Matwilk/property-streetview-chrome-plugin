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

const apiKey = process.env.GOOGLE_API_KEY;

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
  const url = `${baseUrl}?key=${apiKey}&location=${coordinatesString}`

  return url
}

const makeClickableMapIcon = (listing: {
  querySelector(arg0: string): unknown; getElementsByClassName: (arg0: string) => any; 
}) => {
  const anchor = listing.getElementsByClassName('propertyCard-anchor')

  if (!anchor || !anchor.length) {
    return
  }

  const wrapper = listing.getElementsByClassName('propertyCard-wrapper')
  const header = wrapper[0].getElementsByClassName('propertyCard-header')

  const id = anchor[0].id.slice(4);

  if (listing.querySelector(`#clickable-${id}`)) {
    return
  }

  // Create clickable item
  const clickable = document.createElement("div");
  clickable.id = `clickable-${id}`
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
        console.error('Error fetching page', response.statusText)
      }
    } catch (err) {
      console.error('Error thrown fetching page', err)
    }
  });

  // Append the clickable item to the listing
  header[0].appendChild(clickable);
}

const insertIconToListings = () => {
  const results = document.querySelector(".l-searchResults")
  const listings = document.querySelectorAll(".l-searchResult");

  // Add clickable Street View icon and popup to each listing
  listings.forEach((listing, index) => {
    makeClickableMapIcon(listing)

    // Initialize MutationObserver
    const observer = new MutationObserver(handleDomChanges);
    const targetNode = results;
    const config = { childList: true, subtree: true };
    targetNode && observer.observe(targetNode, config);
  });
}


function handleDomChanges(mutationsList: any, observer: any) {
  for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node: {
          matches(arg0: string): unknown;
          querySelector(arg0: string): unknown;
          nodeName: string;
          nodeType: number; getElementsByClassName: (arg0: string) => any; 
}) => {
          if (node.nodeType === 1) {
            if (node.matches('div.l-searchResult.is-list')) {
              makeClickableMapIcon(node)
          }
          }
        })
      }
  }
}

insertIconToListings();