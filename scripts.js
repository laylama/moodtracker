const emojiSelector = document.querySelector('.emoji-selector');
const emojiSpans = document.querySelectorAll('.emoji-selector span');
const moodInput = document.querySelector('.mood-input');
const submitBtn = document.querySelector('.submit-btn');
const moodList = document.querySelector('.mood-list');
const emojiGrid = document.querySelector('.emoji-grid');
const emojiDetails = document.querySelector('.emoji-details-content');
const toggleHistoryBtn = document.querySelector('.toggle-history-btn');



emojiSelector.addEventListener('click', (e) => {
    if (e.target !== emojiSelector) {
        emojiSpans.forEach((span) => span.classList.remove('selected'));
        e.target.classList.add('selected');
        moodInput.style.display = 'block';
        submitBtn.style.display = 'block';
    }
});

submitBtn.addEventListener('click', () => {
    const selectedEmoji = document.querySelector('.selected');
    if (selectedEmoji && moodInput.value) {
        const emoji = selectedEmoji.textContent;
        const moodText = moodInput.value;
        const time = new Date().toLocaleString();
        addToMoodList(emoji, moodText, time);
        addToMoodGrid(emoji, moodText, time);
        saveMoodRecord(emoji, moodText, time);
        moodInput.value = '';
        selectedEmoji.classList.remove('selected');
        moodInput.style.display = 'none';
        submitBtn.style.display = 'none';
    }
});

function addToMoodList(emoji, moodText, time) {
    const listItem = document.createElement('li');
    listItem.dataset.time = time;
    listItem.innerHTML = `${emoji} - ${moodText} - ${time}`;


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.classList.add('delete-btn');
    listItem.appendChild(deleteBtn); // 将 deleteBtn 添加到 listItem
    moodList.appendChild(listItem); // 将 listItem 添加到 moodList
}


moodList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const listItem = e.target.parentNode;
        const time = listItem.dataset.time;
        deleteMoodRecord(time);
        listItem.remove();
    }
});



function addToMoodGrid(emoji, moodText, time) {
    const gridItem = document.createElement('div');
    gridItem.textContent = emoji;
    gridItem.dataset.moodText = moodText;
    gridItem.dataset.time = time;
    gridItem.classList.add('grid-item');
    emojiGrid.appendChild(gridItem);
}

// 修改这个事件监听器
emojiGrid.addEventListener('click', (e) => {
    if (e.target !== emojiGrid) {
        const emoji = e.target.textContent;
        const moodText = e.target.dataset.moodText;
        const time = e.target.dataset.time;
        emojiDetails.innerHTML = `<div class="details-emoji">${emoji}</div><div class="details-text">心情: ${moodText}<br>时间: ${time}</div>`;
    }
});


function saveMoodRecord(emoji, moodText, time) {
    const moodRecord = {
        emoji: emoji,
        moodText: moodText,
        time: time
    };
    let moodRecords = JSON.parse(localStorage.getItem('moodRecords')) || [];
    moodRecords.push(moodRecord);
    localStorage.setItem('moodRecords', JSON.stringify(moodRecords));
}



function loadMoodRecords() {
    const moodRecords = JSON.parse(localStorage.getItem('moodRecords')) || [];
    moodRecords.forEach((record) => {
        addToMoodList(record.emoji, record.moodText, record.time);
        addToMoodGrid(record.emoji, record.moodText, record.time);
    });
}


function deleteMoodRecord(timeToDelete) {
    const storedData = localStorage.getItem('moodRecords');
    if (storedData) {
        const moodRecords = JSON.parse(storedData);
        const updatedMoodRecords = moodRecords.filter((record) => record.time !== timeToDelete);
        localStorage.setItem('moodRecords', JSON.stringify(updatedMoodRecords));
    }
}


function showMoodDetails(emoji, moodText, time) {
    const existingDetails = document.querySelector('.mood-details');
    if (existingDetails) {
        existingDetails.remove();
    }

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('mood-details');
    detailsContainer.innerHTML = `
        <p>${emoji}</p>
        <p>${moodText}</p>
        <p>${time}</p>
    `;
    document.body.appendChild(detailsContainer);
}

emojiGrid.addEventListener('click', (e) => {
    if (e.target !== emojiGrid) {
        const emoji = e.target.textContent;
        const moodText = e.target.dataset.moodText;
        const time = e.target.dataset.time;

        const existingDetails = document.querySelector('.mood-details');

        if (existingDetails && e.target.dataset.detailsVisible === 'true') {
            // If the mood details are already displayed, hide them
            existingDetails.remove();
            e.target.dataset.detailsVisible = 'false';
        } else {
            if (existingDetails) {
                // If there is an existing details element, remove it
                existingDetails.remove();
            }
            // Show the mood details and set the detailsVisible attribute to true
            showMoodDetails(emoji, moodText, time);
            e.target.dataset.detailsVisible = 'true';
        }
    }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}


loadMoodRecords();

toggleHistoryBtn.addEventListener('click', () => {
    moodList.classList.toggle('hidden');
});


