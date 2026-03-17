'use client';
import styles from './rank-card.module.scss';

const Waves = () => {
  return (
    <>
      {/* BACK WAVES */}
      <div className={`${styles.waves} ${styles.back}`}>
        <svg viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
            />
          </defs>
          <use xlinkHref="#gentle-wave" x="48" y="5" />
          <use xlinkHref="#gentle-wave" x="48" y="7" />
        </svg>
      </div>

      {/* FRONT WAVES */}
      <div className={`${styles.waves} ${styles.front}`}>
        <svg viewBox="0 24 150 28" preserveAspectRatio="none">
          <use xlinkHref="#gentle-wave" x="48" y="0" />
          <use xlinkHref="#gentle-wave" x="48" y="3" />
        </svg>
      </div>
    </>
  );
};

export default Waves;
