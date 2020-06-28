const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`
const fetchData = async url => {
 const response = await fetch(url)
 return await response.json()
}

const getMoreSongs = async url => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
  insertSongsIntoPage(data)
}

const insertNextAndPrevButtons = ({ prev, next}) => {
  prevAndNextContainer.innerHTML = `
  ${prev ? `<button class="btn" onClick="getMoreSongs('${prev}')">anteriores</buton>` : ''}
  ${next ? `<button class="btn" onClick="getMoreSongs('${next}')">próximas</buton>` : ''}
  `
}

const insertSongsIntoPage = ({ data, prev, next }) => {
  songsContainer.innerHTML = data.map(({artist: { name }, title}) => `
    <li class="song">
    <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
    </li>
    `).join('')

  if (prev || next) {
   insertNextAndPrevButtons({ prev, next })
   return
 }

 prevAndNextContainer.innerHTML= ''
}
const fetchSongs = async term => {
  const data = await fetchData(`${apiURL}/suggest/${term}`)
  insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
  event.preventDefault()

  const searchTerm = searchInput.value.trim()
  searchInput.value = ''
  searchInput.focus()

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
    return;
  }

  fetchSongs(searchTerm)
}

form.addEventListener('submit', handleFormSubmit)

const insetLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
 songsContainer.innerHTML = `
 <li class="lyrics-container">
 <h2><strong>${songTitle}</strong> - ${artist}</h2>
 <p class="lytics">${lyrics}</p>
 </li>
 `
}

const fetchLytics = async (artist, songTitle) => {
 const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)
 const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
 insetLyricsIntoPage({lyrics, artist, songTitle})
}

const headleSongsContainerClick =  event => {
  const clickedElement = event.target

  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist')
    const songTitle = clickedElement.getAttribute('data-song-title')

    prevAndNextContainer.innerHTML = ''
    fetchLytics(artist, songTitle)
  }
}

songsContainer.addEventListener('click', headleSongsContainerClick)
