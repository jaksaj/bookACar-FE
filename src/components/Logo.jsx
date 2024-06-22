import styles from "./Logo.module.css";

function Logo() {
  return (
    <div>
      <h1 style={{ color: "green" }}>Welcome to</h1>
      <h1 id={styles.logo}>BookACar</h1>
    </div>
  );
}

export default Logo;
