const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "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";

const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>AllRound AI</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 200,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    // Send POST request to API, get response and set the response as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
        // Get the YouTube video ID based on user input using the YouTube Data API
        const YOUTUBE_API_KEY = 'AIzaSyBeIIYFwJA0qFWVNZkEp4oHQ2rsrB-Mo44'; // Paste your YouTube Data API key here
        const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(userText)}&key=${YOUTUBE_API_KEY}`;
        const youtubeResponse = await (await fetch(YOUTUBE_API_URL)).json();
        const videoId = youtubeResponse.items[0].id.videoId;
        const videoTitle = youtubeResponse.items[0].snippet.title;

        // Create a div for the 'Reference Video' text
        const referenceDiv = document.createElement('div');
        referenceDiv.textContent = 'Reference Video:';
        referenceDiv.style.fontWeight = 'bold'; // Make the text bold
        referenceDiv.style.fontSize = '20px'; // Increase the font size
        referenceDiv.style.marginTop = '20px'; // Add some margin at the top

        // Create a line break element
        const lineBreak = document.createElement('br');

        // Create a div for the video title and set the title text
        const titleDiv = document.createElement('div');
        titleDiv.textContent = 'Title: ' + videoTitle; // Add the video title
        titleDiv.style.fontWeight = 'bold'; // Make the text bold
        titleDiv.style.fontSize = '20px'; // Increase the font size
        titleDiv.style.marginBottom = '10px'; // Add some margin at the bottom

        // Create an iframe for the YouTube video
        const iframe = document.createElement('iframe');
        iframe.width = 560;
        iframe.height = 315;
        iframe.src = `https://www.youtube.com/embed/${videoId}`; // Use the video ID from the YouTube Data API
        iframe.title = 'YouTube video';
        iframe.frameborder = 0;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Append the referenceDiv, lineBreak, titleDiv, and iframe to the incomingChatDiv
        incomingChatDiv.appendChild(referenceDiv);
        incomingChatDiv.appendChild(titleDiv);
        incomingChatDiv.appendChild(iframe);
        incomingChatDiv.appendChild(lineBreak);

        
            const referenceDivImg = document.createElement('div');
            referenceDivImg.textContent = 'Reference Images:';
            referenceDivImg.style.fontWeight = 'bold'; // Make the text bold
            referenceDivImg.style.fontSize = '20px'; // Increase the font size
            referenceDivImg.style.marginTop = '20px'; // Add some margin at the top

            // Get multiple image URLs based on user input using the Google Custom Search JSON API
            const GOOGLE_API_KEY = 'AIzaSyBI_YndaWIzg64IsjOfdu3XOVW-oMe8yrs'; // Paste your Google API key here
            const CX = '369494fdb347f4a36'; // Paste your Programmable Search Engine ID here
            const GOOGLE_API_URL = `https://www.googleapis.com/customsearch/v1?cx=${CX}&q=${encodeURIComponent(userText)}&searchType=image&key=${GOOGLE_API_KEY}`;
            const googleResponse = await (await fetch(GOOGLE_API_URL)).json();

            // Create a div for the image grid
            const imageGridDiv = document.createElement('div');
            imageGridDiv.classList.add('image-grid');

            // Loop through the images and create img elements for each image
            googleResponse.items.forEach((item, index) => {
                const imageUrl = item.link;
            
                // Create an img element for the image
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = userText;
                img.width = 250; // Adjust the width as needed
                img.height = 250; // Adjust the height as needed
            
                // Add a click event listener to open the image in a new window or perform a specific action
                img.addEventListener('click', () => {
                    window.open(imageUrl, '_blank'); // Open the image in a new tab
                    // You can replace the above line with your custom action if needed
                });
            
                // Append the img element to the image grid div
                imageGridDiv.appendChild(img);
            
                // Create a line break element after every 3 images for better readability
                if ((index + 1) % 3 === 0) {
                    const lineBreakImg = document.createElement('br');
                    imageGridDiv.appendChild(lineBreakImg);
                }
            });
            
            // Append the referenceDivImg and imageGridDiv to the incomingChatDiv
            incomingChatDiv.appendChild(referenceDivImg);
            incomingChatDiv.appendChild(imageGridDiv);
            

        const referenceDivLink = document.createElement('div');
        referenceDivLink.textContent = 'Reference Link: ';
        referenceDivLink.style.fontWeight = 'bold'; // Make the text bold
        referenceDivLink.style.fontSize = '20px'; // Increase the font size
        referenceDivLink.style.marginTop = '20px'; // Add some margin at the top

        // Create a line break element
        const lineBreakLink = document.createElement('br');

        if (googleResponse.items && googleResponse.items.length > 0) {
            const referenceLinks = googleResponse.items.slice(0, 3).map(item => item.link);
        
            // Append the referenceDivLink and lineBreakLink to the incomingChatDiv
            incomingChatDiv.appendChild(referenceDivLink);
            incomingChatDiv.appendChild(lineBreakLink);
        
            referenceLinks.forEach(link => {
                // Create an anchor (a) element for the link
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.textContent = link;
                linkElement.target = '_blank'; // Open the link in a new tab

                // const body = document.body;
                // if (body.classList.contains('dark-mode')) {
                //     linkElement.style.color = 'white'; // Dark mode color
                // } else {
                //     linkElement.style.color = 'blue'; // Light mode color
                // }
        
                // Create a div to hold the anchor element
                const linkDiv = document.createElement('div');
                linkDiv.appendChild(linkElement);
        
                // Append the linkDiv to the incomingChatDiv
                incomingChatDiv.appendChild(linkDiv);
            });
        }
        

    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chat-bot.png" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if (!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);