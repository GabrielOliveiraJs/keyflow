import styles from './Brand.module.css'

export default function Brand() {
  return (
    <a className={styles.brand} href="#inicio" aria-label="KeyFlow, início">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M6 9.5h20M6 16h20M6 22.5h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="22.5" r="3" fill="currentColor" />
        </svg>
      </span>
      <span className={styles.brandName}>key<span>flow</span></span>
    </a>
  )
}
