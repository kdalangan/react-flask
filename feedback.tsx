import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

const FeedbackPage = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Default to FEEDBACK page (index 2)
  const [showDefects, setShowDefects] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<keyof typeof defectTypesDisplay | null>(null);
  const navRefs = useRef<HTMLDivElement[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [defectFeedbacks, setDefectFeedbacks] = useState<any[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([]);

  const navItems = [
    { label: 'HOME', route: '/' },
    { label: 'CAPTURE or UPLOAD PCB', route: '/capture' },
    { label: 'FEEDBACK', route: '/feedback' },
    { label: 'SIMULATE CONTINUITY', route: '/simulate' },
  ];

  // Map these to match backend CLASSES array
  const defectTypes = [
    "open", 
    "short", 
    "mousebite", 
    "protrusion", 
    "copper", 
    "pin-hole"
  ];

  // For display purposes
  const defectTypesDisplay = {
    "open": "Open Circuits",
    "short": "Short Circuits",
    "mousebite": "Mousebites",
    "protrusion": "Protrusion",
    "copper": "Spurious Copper",
    "pin-hole": "Pin Holes"
  };

  useEffect(() => {
    const activeEl = navRefs.current[activeIndex];
    const pillEl = pillRef.current;

    if (activeEl && pillEl) {
      const { offsetLeft, offsetWidth } = activeEl;
      pillEl.style.transform = `translateX(${offsetLeft}px)`;
      pillEl.style.width = `${offsetWidth}px`;
    }
  }, [activeIndex]);

  // Fetch and store feedback data when component mounts
  useEffect(() => {
    // This would normally come from your backend via props or context
    // For this example, we'll simulate the feedback data structure
    const sampleFeedbacks = [
      {
        type: "mousebite",
        count: 2,
        feedback: "<span style='color:#0066cc;'>2 Mousebite(s) detected</span><br><span style='color:#ff0000;'>Impact:</span> Possible leak paths.<br><span style='color:#008000;'>Solution:</span> Verify that all vias are properly filled and sealed."
      },
      {
        type: "open",
        count: 1,
        feedback: "<span style='color:#0066cc;'>1 Open Circuit(s) detected</span><br><span style='color:#ff0000;'>Impact:</span> Electrical connectivity issues.<br><span style='color:#008000;'>Solution:</span> Check for broken traces or disconnects."
      },
      {
        type: "short",
        count: 3,
        feedback: "<span style='color:#0066cc;'>3 Short Circuit(s) detected</span><br><span style='color:#ff0000;'>Impact:</span> Excessive current flow, potential overheating.<br><span style='color:#008000;'>Solution:</span> Inspect for unintended connections between traces."
      }
    ];
    
    setDefectFeedbacks(sampleFeedbacks);
    setFilteredFeedbacks(sampleFeedbacks);
  }, []);

  // Filter feedbacks when a defect is selected
  useEffect(() => {
    if (selectedDefect) {
      const filtered = defectFeedbacks.filter(item => item.type === selectedDefect);
      setFilteredFeedbacks(filtered);
    } else {
      setFilteredFeedbacks(defectFeedbacks);
    }
  }, [selectedDefect, defectFeedbacks]);

  const styles: { [key: string]: CSSProperties } = {
    // ... styles remain unchanged
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to bottom, white 50%, #f0f0f0 50%)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '.10px 30px',
      backgroundColor: 'white',
      position: 'fixed',
      marginRight: '.1px',
      top: 0,
      left: 0,
      right: 0.001,
      zIndex: 1000,
      height: '80px',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    logo: {
      marginTop: '20px',
      width: '100px',
      height: '100px',
      borderRadius: '8px',
      position: 'relative',
    },
    brandName: {
      fontSize: '24px',
      marginTop: '11px',
      fontWeight: 'bold',
      marginLeft: '.5px',
      color: '#000000',
    },
    navBarContainer: {
      marginTop: '15px',
      width: 'fit-content',
      marginRight: '.1px',
      backgroundColor: '#424242',
      borderRadius: '100px',
      display: 'flex',
      justifyContent: 'flex-end',
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
      marginRight: '.1px',
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
      marginTop: '95px',
    },
    contentContainer: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      width: '100%',
      flexGrow: 1,
    },
    comparisonSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    feedbackColumns: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      gap: '30px',
    },
    column: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '500px',
      marginRight: '10px',
      marginLeft: '20px',
    },
    imageContainer: {
      width: '90%',
      height: '250px',
      backgroundColor: '#ffd700',
      borderRadius: '5px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '75px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ff0000',
      marginBottom: '20px',
      marginLeft: '80px',
      width: '100%',
    },
    resultBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#cecece',
      padding: '12px 15px',
      borderRadius: '5px',
      margin: '10px 0',
      minWidth: '100%',
      textAlign: 'center',
    },
    similarityLabel: {
      marginRight: '10px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000000',
    },
    similarityValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000000',
    },
    gradeLabel: {
      marginRight: '10px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000000',
    },
    gradeValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000000',
    },
    actionButtons: {
      display: 'flex',
      gap: '5px',
      marginTop: '20px',
      justifyContent: 'center',
      width: '100%',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#cecece',
      padding: '10px 15px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#000000',
      marginLeft: '2px',
      marginRight: '2px',
    },
    buttonIcon: {
      marginRight: '5px',
      fontSize: '14px',
      color: '#000000',
    },
    errorsSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginRight: '10px',
    },
    errorsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      marginRight: '10px',
      width: '100%',
    },
    errorsTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ff0000',
      textAlign: 'center',
      flex: 1,
      marginLeft: '20px',
    },
    showDefectsButton: {
      backgroundColor: '#cecece',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '10px',
      border: 'none',
      cursor: 'pointer',
      color: '#000000',
      marginLeft: '10 px',
      marginRight: '20px',
    },
    defectsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      width: '100%',
    },
    defectItem: {
      backgroundColor: '#cecece',
      padding: '12px 15px',
      borderRadius: '5px',
      fontSize: '16px',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
    },
    defectLabel: {
      fontWeight: 'bold',
      color: '#000000',
    },
    defectValue: {
      fontWeight: 'bold',
      color: '#C30000',
      marginLeft: '5px',
    },
    defectsDropdown: {
      position: 'absolute',
      backgroundColor: '#8E8E8E',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 10,
      marginTop: '5px',
      right: 0,
      width: '180px',
    },
    defectOption: {
      padding: '8px 12px',
      cursor: 'pointer',
      borderBottom: '1px solid #ddd',
      textAlign: 'center',
      backgroundColor: '#8E8E8E',
      borderRadius: '3px',
      marginBottom: '5px',
      transition: 'background-color 0.2s ease',
      fontWeight: 500,
      color: '#000000',
      fontSize: '10px',
    },
    defectOptionLast: {
      padding: '8px 12px',
      cursor: 'pointer',
      backgroundColor: '#e9e9e9',
      textAlign: 'center',
      borderRadius: '3px',
      fontWeight: 500,
      color: '#000000',
      fontSize: '10px',
    },
    defectsButtonContainer: {
      position: 'relative',
    },
    grayBox: {
      width: '100%',
      backgroundColor: '#eeeeee',
      padding: '20px',
      borderRadius: '5px',
      marginRight: '50px',
    },
    resultsContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: '15px',
    },
    resultBoxesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      width: '100%',
    },
    feedbackContainer: {
      backgroundColor: '#cecece',
      padding: '15px',
      borderRadius: '5px',
      marginTop: '10px',
      width: '100%'
    },
    feedbackTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '10px',
      textAlign: 'center' // Center the title text
    },
    feedbackText: {
      fontSize: '14px',
      lineHeight: '1.4'
    },
    simulationButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '15px',
    },
  };

  // Get the button text based on selected defect
  const getDefectButtonText = () => {
    if (selectedDefect) {
      return ` ${defectTypesDisplay[selectedDefect].toUpperCase()} ${showDefects ? '▲' : '▼'}`;
    }
    return `SHOW ALL DEFECTS ${showDefects ? '▲' : '▼'}`;
  };

  const handleDefectSelection = (defect: string) => {
    setShowDefects(false);
    setSelectedDefect(defect === "all" ? null : defect as keyof typeof defectTypesDisplay);
    console.log(`Selected defect: ${defect}`);
  };

  // Function to safely render HTML content
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div style={styles.container}>
      {/* Header with Logo and Nav */}
      <header style={styles.header}>
        <div 
          style={styles.logoContainer}
          onClick={() => navigate('/')}
        >
          <div style={styles.logo}>
            <img src="src/assets/pxrt.png" alt="Logo" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={styles.brandName}>PXRT</div>
        </div>

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
      </header>

      {/* Yellow Divider */}
      <div style={styles.divider}></div>

      {/* Main Content */}
      <div style={styles.contentContainer}>
        <div style={styles.comparisonSection}>
          <div style={styles.feedbackColumns}>
            {/* Left Column */}
            <div style={styles.column}>
              <div style={styles.imageContainer}>
                <div>PCB Image 1</div>
              </div>
              <div style={styles.sectionTitle}>HIGHLIGHTED DIFFERENCES</div>
              
              {/* Gray Box - Results Section */}
              <div style={styles.grayBox}>
                <div style={styles.resultsContainer}>
                  <div style={styles.resultBoxesContainer}>
                    <div style={styles.defectItem}>
                      <span style={styles.similarityLabel}>SIMILARITY:</span>
                      <span style={styles.similarityValue}>85%</span>
                    </div>
                    <div style={styles.defectItem}>
                      <span style={styles.gradeLabel}>GRADE:</span>
                      <span style={styles.gradeValue}>B</span>
                    </div>
                  </div>
                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => navigate('/capture')}
                    >
                      <span style={styles.buttonIcon}>⬆️</span>
                      UPLOAD NEW IMAGES
                    </button>
                    <button style={styles.actionButton}>
                      <span style={styles.buttonIcon}>⬇️</span>
                      DOWNLOAD PDF REPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.column}>
              <div style={styles.imageContainer}>
                <div>PCB Image 2</div>
              </div>
              <div style={styles.errorsSection}>
                <div style={styles.errorsHeader}>
                  <div style={styles.errorsTitle}>
                    ERRORS DETECTED
                  </div>
                  <div style={styles.defectsButtonContainer}>
                    <button 
                      style={styles.showDefectsButton}
                      onClick={() => setShowDefects(!showDefects)}
                    >
                      {getDefectButtonText()}
                    </button>
                    
                    {showDefects && (
                      <div style={styles.defectsDropdown}>
                        <div 
                          style={styles.defectOption}
                          onClick={() => handleDefectSelection("all")}
                        >
                          All Defects
                        </div>
                        {defectTypes.map((defect, index) => (
                          <div 
                            key={index}
                            style={index === defectTypes.length - 1 ? styles.defectOptionLast : styles.defectOption}
                            onClick={() => handleDefectSelection(defect)}
                          >
                            {defectTypesDisplay[defect as keyof typeof defectTypesDisplay] || defect}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gray Box containing defects grid or details */}
                <div style={styles.grayBox}>
                  {!selectedDefect ? (
                    // Show the grid of all detected defects without details
                    <div style={styles.defectsGrid}>
                      {defectFeedbacks.map((item: { type: keyof typeof defectTypesDisplay; count: number }, index) => (
                        <div 
                          key={index} 
                          style={styles.defectItem}
                          onClick={() => setSelectedDefect(item.type)}
                        >
                          <span style={styles.defectLabel}>Defect:</span>
                          <span style={styles.defectValue}>
                            {defectTypesDisplay[item.type]} ({item.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Show detailed feedback for the selected defect
                    <div>
                      {filteredFeedbacks.map((item: { type: keyof typeof defectTypesDisplay; count: number; feedback: string }, index) => (
                        <div key={index} style={styles.feedbackContainer}>
                          <div 
                            style={styles.feedbackText}
                            dangerouslySetInnerHTML={renderHTML(item.feedback)}
                          />
                        </div>
                      ))}
                      
                      {/* New "Go to Simulation" button container */}
                      <div style={styles.simulationButtonContainer}>
                        <button 
                          style={styles.actionButton}
                          onClick={() => navigate('/simulate')}
                        >
                          <span style={styles.buttonIcon}>🔄</span>
                          GO TO SIMULATION
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;