export const clickOutside = cleanValue => event => {
  const searchComponent = document.getElementById('search-component')
  let target = event.target

  while (target) {
    if (target?.id == searchComponent.id) return

    target = target.parentNode
  }

  cleanValue()
}
