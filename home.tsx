import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRefs = useRef<HTMLDivElement[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { label: 'HOME', route: '/' },
    { label: 'CAPTURE or UPLOAD PCB', route: '/capture' },
    { label: 'FEEDBACK', route: '/feedback' },
    { label: 'SIMULATE CONTINUITY', route: '/simulate' },
  ];

  useEffect(() => {
    const activeEl = navRefs.current[activeIndex];
    const pillEl = pillRef.current;

    if (activeEl && pillEl) {
      const { offsetLeft, offsetWidth } = activeEl;
      pillEl.style.transform = `translateX(${offsetLeft}px)`;
      pillEl.style.width = `${offsetWidth}px`;
    }
  }, [activeIndex]);

  const styles: { [key: string]: React.CSSProperties } = {
    homeContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
    },
    navBarContainer: {
      marginTop: '10px',
      width: 'fit-content',
      marginLeft: 'auto',
      marginRight: '20px',
      backgroundColor: '#424242',
      borderRadius: '100px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '15px 20px',
      position: 'relative',
      overflow: 'hidden',
    },
    navBar: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    navItem: {
      padding: '10px 20px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      color: 'white',
      zIndex: 1,
    },
    activePill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '50px',
      top: 0,
      left: 0,
      transition: 'transform 0.3s ease, width 0.3s ease',
      zIndex: 0,
    },
    divider: {
      height: '10px',
      backgroundColor: '#ffc107',
      width: '100%',
      marginTop: '10px',
    },
    contentContainer: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    logoContainer: {
      marginTop: '5px',
      width: '600px',
      height: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    brandName: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
      color: '#000000',
    },
  };

  return (
    <div style={styles.homeContainer}>
      {/* Navigation Bar */}
      <div style={styles.navBarContainer}>
        <nav style={styles.navBar}>
          <div ref={pillRef} style={styles.activePill}></div>
          {navItems.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.navItem,
                color: activeIndex === index ? 'black' : 'white',
              }}
              ref={(el) => {
                if (el) {
                  navRefs.current[index] = el;
                }
              }}
              onClick={() => {
                setActiveIndex(index);
                navigate(item.route);
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Yellow Divider */}
      <div style={styles.divider}></div>

      {/* Main Content */}
      <div style={styles.contentContainer}>
        <div style={styles.logoContainer}>
        <img src="src/assets/1.png" alt="Logo" style={{ width: '100%', height: 'auto' }} />


        </div>
        <h1 style={styles.brandName}>PXRT</h1>
      </div>
    </div>
  );
};

export default Home;