import React from 'react'
import '../styles/App.css'
export default function Loader() {
  return (
      <div style={styles.loaderWrapper}>
        <div style={styles.loader}></div>
        <p>Checking authentication...</p>
      </div>
    );
}

const styles = {
  loaderWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};