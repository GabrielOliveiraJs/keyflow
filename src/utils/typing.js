export function getTypingMetrics(referenceText, typedText, elapsedSeconds) {
  const reference = Array.from(referenceText)
  const typed = Array.from(typedText)
  const correctChars = typed.reduce(
    (total, character, index) => total + (character === reference[index] ? 1 : 0),
    0,
  )
  const errors = typed.length - correctChars
  const elapsedMinutes = Math.max(elapsedSeconds, 1) / 60

  return {
    typedChars: typed.length,
    correctChars,
    errors,
    accuracy: typed.length ? Math.round((correctChars / typed.length) * 100) : 0,
    // PPM/WPM considera uma palavra padrão como cinco caracteres.
    ppm: elapsedSeconds > 0 ? Math.round(correctChars / 5 / elapsedMinutes) : 0,
    progress: reference.length ? Math.min(100, Math.round((typed.length / reference.length) * 100)) : 0,
  }
}

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')
  return hours
    ? `${String(hours).padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`
    : `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${formattedSeconds}`
}

export function getFilteredExercises(exercises, category, level) {
  return exercises.filter((exercise) => {
    const matchesCategory = category === 'Todas' || exercise.category === category
    const matchesLevel = level === 'todos' || exercise.difficulty === level
    return matchesCategory && matchesLevel
  })
}
