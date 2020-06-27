const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const insertSongsIntoPage = songsInfo => {
  console.log(songsInfo.data.map(song => `<li>${song.title}</li>`))

  // songsContainer.innerHTML = songsInfo.data.map(song => `
  //   <li>${song.title}</li>
  //   `)
}
const fetchSongs = async term => {
  const response = await fetch(`${apiURL}/suggest/${term}`)
  const data = await response.json()

  insertSongsIntoPage(data)
}

form.addEventListener('submit', event => {
  event.preventDefault()

  const searchTerm = searchInput.value.trim()

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
    return;
  }

  fetchSongs(searchTerm)
})
