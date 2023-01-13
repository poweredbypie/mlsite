export const getLevels = () => {
  fetch(`/levels`).then((data) => data.json())
}

export const getLevel = (name) => {
  fetch(`/levels/${name}`).then((data) => data.json())
}

export const getPlayers = () => {
  fetch(`/players`).then((data) => data.json())
}

export const getPlayer = (name) => {
  fetch(`/players/${name}`).then((data) => data.json())
}
