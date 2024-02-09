const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
let resultType = "all";
const API_KEY = "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";

const loadDataFromLocalstorage = () => {
  const themeColor = localStorage.getItem("themeColor");

  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

  const defaultText = `<div class="default-text">
                            <h1>AllRound AI</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
}

const getOpenAIResponse = async () => {
  const API_URL = "https://api.openai.com/v1/completions";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt: userText,
      max_tokens: 2000,
      temperature: 0.2,
      n: 1,
      stop: null
    })
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    return response.choices[0].text.trim();
  } catch (error) {
    throw new Error("Error fetching data from OpenAI API");
  }
}

const getYoutubeVideo = async () => {
  const YOUTUBE_API_KEY = 'AIzaSyBeIIYFwJA0qFWVNZkEp4oHQ2rsrB-Mo44';
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(userText)}&key=${YOUTUBE_API_KEY}`;
  const youtubeResponse = await (await fetch(YOUTUBE_API_URL)).json();
  const videoId = youtubeResponse.items[0].id.videoId;
  const videoTitle = youtubeResponse.items[0].snippet.title;

  return { videoId, videoTitle };
}

const getGoogleImages = async () => {
  const GOOGLE_API_KEY = 'AIzaSyBI_YndaWIzg64IsjOfdu3XOVW-oMe8yrs';
  const CX = '369494fdb347f4a36';
  const GOOGLE_API_URL = `https://www.googleapis.com/customsearch/v1?cx=${CX}&q=${encodeURIComponent(userText)}&searchType=image&key=${GOOGLE_API_KEY}`;
  const googleResponse = await (await fetch(GOOGLE_API_URL)).json();

  const imageLinks = googleResponse.items.map(item => item.link);
  return imageLinks;
}

const displayReferenceVideo = (incomingChatDiv, videoTitle, videoId) => {
  const referenceDiv = document.createElement('div');
  referenceDiv.textContent = 'Reference Video:';
  referenceDiv.style.fontWeight = 'bold';
  referenceDiv.style.fontSize = '20px';
  referenceDiv.style.marginTop = '20px';

  const lineBreak = document.createElement('br');

  const titleDiv = document.createElement('div');
  titleDiv.textContent = 'Title: ' + videoTitle;
  titleDiv.style.fontWeight = 'bold';
  titleDiv.style.fontSize = '20px';
  titleDiv.style.marginBottom = '10px';

  const iframe = document.createElement('iframe');
  iframe.width = 560;
  iframe.height = 315;
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = 'YouTube video';
  iframe.frameborder = 0;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;

  incomingChatDiv.appendChild(referenceDiv);
  incomingChatDiv.appendChild(titleDiv);
  incomingChatDiv.appendChild(iframe);
  incomingChatDiv.appendChild(lineBreak);
}

const displayReferenceImages = (incomingChatDiv, imageLinks) => {
  const referenceDivImg = document.createElement('div');
  referenceDivImg.textContent = 'Reference Images:';
  referenceDivImg.style.fontWeight = 'bold';
  referenceDivImg.style.fontSize = '20px';
  referenceDivImg.style.marginTop = '20px';

  const imageGridDiv = document.createElement('div');
  imageGridDiv.classList.add('image-grid');

  imageLinks.forEach((imageUrl, index) => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = userText;
    img.width = 250;
    img.height = 250;

    img.addEventListener('click', () => {
      window.open(imageUrl, '_blank');
    });

    imageGridDiv.appendChild(img);

    if ((index + 1) % 3 === 0) {
      const lineBreakImg = document.createElement('br');
      imageGridDiv.appendChild(lineBreakImg);
    }
  });

  incomingChatDiv.appendChild(referenceDivImg);
  incomingChatDiv.appendChild(imageGridDiv);
}

const displayReferenceLinks = (incomingChatDiv, referenceLinks) => {
  const referenceDivLink = document.createElement('div');
  referenceDivLink.textContent = 'Reference Link: ';
  referenceDivLink.style.fontWeight = 'bold';
  referenceDivLink.style.fontSize = '20px';
  referenceDivLink.style.marginTop = '20px';

  const lineBreakLink = document.createElement('br');

  if (referenceLinks && referenceLinks.length > 0) {
    const linksToShow = referenceLinks.slice(0, 3);
    linksToShow.forEach(link => {
      const linkElement = document.createElement('a');
      const linkDiv = document.createElement('div');
      linkElement.textContent = link;
      linkElement.href = link;
      linkElement.target = '_blank';
      linkDiv.appendChild(linkElement);

      incomingChatDiv.appendChild(linkDiv);
    });
  }

  incomingChatDiv.appendChild(referenceDivLink);
  incomingChatDiv.appendChild(lineBreakLink);
}

const displayErrorMessage = (incomingChatDiv) => {
  const pElement = document.createElement("p");
  pElement.classList.add("error");
  pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
}

const handleChatResponse = async (incomingChatDiv) => {
  try {
    const selectedOptions = document.querySelectorAll('#result-type input:checked');
    const selectedResultTypes = Array.from(selectedOptions).map(option => option.value);

    for (const resultType of selectedResultTypes) {
      if (resultType === "text") {
        const openAIResponse = await getOpenAIResponse();
        if (openAIResponse) {
          const openAIResponseDiv = document.createElement('div');
          openAIResponseDiv.textContent = openAIResponse;
          incomingChatDiv.appendChild(openAIResponseDiv);
        }
      }

      if (resultType === "video") {
        const youtubeData = await getYoutubeVideo();
        if (youtubeData) {
          displayReferenceVideo(incomingChatDiv, youtubeData.videoTitle, youtubeData.videoId);
        }
      }

      if (resultType === "image") {
        const googleImagesLinks = await getGoogleImages();
        if (googleImagesLinks) {
          displayReferenceImages(incomingChatDiv, googleImagesLinks);
        }
      }

      if (resultType === "link") {
        const googleImagesLinks = await getGoogleImages();
        if (googleImagesLinks) {
          displayReferenceLinks(incomingChatDiv, googleImagesLinks);
        }
      }
    }
  } catch (error) {
    displayErrorMessage(incomingChatDiv);
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  localStorage.setItem("all-chats", chatContainer.innerHTML);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
  const reponseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(reponseTextElement.textContent);
  copyBtn.textContent = "done";
  setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/ai/images/chat-bot.png" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  handleChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  resultType = document.getElementById("result-type").querySelector(":checked").value || "all";

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;

  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/static/ai/images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

(function ($) {
  var CheckboxDropdown = function (el) {
    var _this = this;
    this.isOpen = false;
    this.areAllChecked = false;
    this.$el = $(el);
    this.$label = this.$el.find('.dropdown-label');
    this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
    this.$inputs = this.$el.find('[type="checkbox"]');

    this.onCheckBox();

    this.$label.on('click', function (e) {
      e.preventDefault();
      _this.toggleOpen();
    });

    this.$checkAll.on('click', function (e) {
      e.preventDefault();
      _this.onCheckAll();
    });

    this.$inputs.on('change', function (e) {
      _this.onCheckBox();
    });
  };

  CheckboxDropdown.prototype.onCheckBox = function () {
    this.updateStatus();
  };

  CheckboxDropdown.prototype.updateStatus = function () {
    var checked = this.$el.find(':checked');

    this.areAllChecked = false;
    this.$checkAll.html('Check All');

    if (checked.length <= 0) {
      this.$label.html('Options');
    }
    else if (checked.length === 1) {
      this.$label.html(checked.parent('label').text());
    }
    else if (checked.length === this.$inputs.length) {
      this.$label.html('All Selected');
      this.areAllChecked = true;
      this.$checkAll.html('Uncheck All');
    }
    else {
      this.$label.html(checked.length + ' Selected');
    }
  };

  CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
    if (!this.areAllChecked || checkAll) {
      this.areAllChecked = true;
      this.$checkAll.html('Uncheck All');
      this.$inputs.prop('checked', true);
    }
    else {
      this.areAllChecked = false;
      this.$checkAll.html('Check All');
      this.$inputs.prop('checked', false);
    }

    this.updateStatus();
  };

  CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
    var _this = this;

    if (!this.isOpen || forceOpen) {
      this.isOpen = true;
      this.$el.addClass('on');
      $(document).on('click', function (e) {
        if (!$(e.target).closest('[data-control]').length) {
          _this.toggleOpen();
        }
      });
    }
    else {
      this.isOpen = false;
      this.$el.removeClass('on');
      $(document).off('click');
    }
  };

  var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
  for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
    new CheckboxDropdown(checkboxesDropdowns[i]);
  }
})(jQuery);

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);