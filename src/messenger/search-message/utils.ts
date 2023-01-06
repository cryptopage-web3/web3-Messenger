import { scrollToDropDownListMessage } from './scroll-to-drop-down-list-message'

const uiChannel = new BroadcastChannel('peer:ui')

export const focusMessage = value =>
  uiChannel.postMessage({
    type: 'focusMessage',
    payload: value
  })

export const setActiveSuggestion = (array, index) => {
  return array.map((item, i) => {
    if (i !== index) {
      return { ...item, props: { ...item.props, active: false } }
    }

    return { ...item, props: { ...item.props, active: true } }
  })
}

export const scrollToPrev = (
  suggestionIndex,
  setSuggestionIndex,
  suggestions,
  setSuggestions
) => {
  let newIndex = suggestionIndex
  const len = suggestions.length

  if (newIndex === undefined) {
    newIndex = len - 1
  } else {
    newIndex = (len + newIndex - 1) % len
  }

  const messageKey = suggestions[newIndex].props.key

  scrollToDropDownListMessage(newIndex)

  selectSuggestion(messageKey, newIndex, setSuggestionIndex, setSuggestions)
}

export const scrollToNext = (
  suggestionIndex,
  setSuggestionIndex,
  suggestions,
  setSuggestions
) => {
  let newIndex = suggestionIndex
  const len = suggestions.length

  if (newIndex === undefined) {
    newIndex = 0
  } else {
    newIndex = (newIndex + 1) % len
  }

  const messageKey = suggestions[newIndex].props.key

  scrollToDropDownListMessage(newIndex)

  selectSuggestion(messageKey, newIndex, setSuggestionIndex, setSuggestions)
}

export const selectSuggestion = (
  messageKey,
  index,
  setSuggestionIndex,
  setSuggestions
) => {
  setSuggestionIndex(index)

  setSuggestions(prev => setActiveSuggestion(prev, index))

  focusMessage(messageKey)
}
