import styles from './TypingText.module.css'

export default function TypingText({ referenceText, typedText }) {
  const referenceChars = Array.from(referenceText)
  const typedChars = Array.from(typedText)

  return (
    <div className={styles.text} aria-label="Texto de referência">
      {referenceChars.map((character, index) => {
        let state = ''
        if (index < typedChars.length) {
          state = typedChars[index] === character ? styles.correct : styles.incorrect
        } else if (index === typedChars.length) {
          state = styles.current
        }

        return (
          <span className={`${styles.character} ${state}`} key={`${index}-${character}`}>
            {character === ' ' ? '\u00a0' : character}
          </span>
        )
      })}
    </div>
  )
}
