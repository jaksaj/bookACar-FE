import styles from "./Logo.module.css";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <h1 className={styles.welcomeText}>Welcome to</h1>
      <h1 className={styles.logo}>BookACar</h1>
    </div>
  );
}

export default Logo;
