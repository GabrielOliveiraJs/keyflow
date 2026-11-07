import styles from './MetricCard.module.css'

export default function MetricCard({ label, value, detail, icon, accent = '' }) {
  const accentClass = accent ? styles[accent] : ''

  return (
    <article className={`${styles.card} ${accentClass}`}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={styles.icon} aria-hidden="true">{icon}</span>
      </div>
      <strong className={styles.value}>{value}</strong>
      {detail && <span className={styles.detail}>{detail}</span>}
    </article>
  )
}
