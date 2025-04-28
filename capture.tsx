import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
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
    marginTop: '95px', // Added top margin to account for fixed header
  },
  contentContainer: {
    marginTop: '.1px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 200px',
    flexGrow: 1,
    gap: '80px', // Add space between containers
  },
  captureSection: {
    backgroundColor: '#ffd700',
    borderRadius: '100px',
    padding: '30px',
    width: '50% ', // Make capture section smaller
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '500px', // Limit maximum width
    justifyContent: 'center',
  },
  uploadSection: {
    backgroundColor: '#ffd700',
    borderRadius: '100px',
    padding: '30px',
    width: '50%', // Make upload section slightly larger
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '500px', // Limit maximum width
  },
  cameraContainer: {
    width: '250px',
    height: '250px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cameraIcon: {
    fontSize: '50px',
    color: '#4a4a4a',
  },
  captureButton: {
    backgroundColor: '#4a4a4a',
    color: 'white',
    padding: '10px 30px', // Slightly smaller padding
    borderRadius: '50px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px', // Slightly smaller font
    marginTop: '15px',
  },
  uploadContainer: {
    width: '90%',
  
    
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginBottom: '12px',
    textAlign: 'left',
    width: '100%',
  },
  fileUploadArea: {
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '95%',
  },
  chooseFileButton: {
    backgroundColor: '#4a4a4a',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '15px',
    fontSize: '14px',
  },
  fileStatus: {
    color: '#666',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '60%',
  },
  uploadButton: {
    backgroundColor: '#4a4a4a',
    color: 'white',
    padding: '10px 30px',
    borderRadius: '50px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '15px',
  },
  hiddenFileInput: {
    display: 'none',
  }
};

const CapturePCBPage = () => {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const testFileInputRef = useRef<HTMLInputElement | null>(null);
  const templateFileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(1); // Default to CAPTURE page (index 1)
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

  const handleTestFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTestFile(event.target.files[0]);
    }
  };

  const handleTemplateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTemplateFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!testFile || !templateFile) {
      setError('Please choose both files');
      return;
    }

    setUploading(true);

    try {
      // Perform file upload logic here, e.g., call backend API
      const formData = new FormData();
      formData.append('testFile', testFile);
      formData.append('templateFile', templateFile);

      // Replace with your backend URL
      const response = await fetch('http://localhost:5000/web_app.py', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Handle success (e.g., clear files, show success message, etc.)
      setTestFile(null);
      setTemplateFile(null);
      setError(null);

      // Simulate success message
      alert('Upload successful');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with Logo and Nav */}
      <header style={styles.header}>
        <div style={styles.logoContainer} onClick={() => navigate('/')}>
          <div style={styles.logo}>
            <img src="src/template/assets/pxrt.png" alt="Logo" style={{ width: '100%', height: 'auto' }} />
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
        {/* Left Section - Capture PCB */}
        <div style={styles.captureSection}>
          {/* Camera preview container */}
          <div style={styles.cameraContainer}>
            <div style={styles.cameraIcon}>📷</div>
          </div>
          <button style={styles.captureButton}>CAPTURE PCB</button>
        </div>
  
        {/* Right Section - Upload PCB */}
        <div style={styles.uploadSection}>
          <div style={styles.uploadContainer}>
            {/* Test Image */}
            <h3 style={styles.sectionTitle}>Test Image:</h3>
            <div style={styles.fileUploadArea}>
              <input
                type="file"
                onChange={handleTestFileChange}
                ref={testFileInputRef}
                style={styles.hiddenFileInput}
                accept="image/*"
              />
              <button 
                style={styles.chooseFileButton}
                onClick={() => testFileInputRef.current?.click()}
              >
                CHOOSE FILE
              </button>
              <span style={styles.fileStatus}>
                {testFile ? testFile.name : 'No file chosen'}
              </span>
            </div>
  
            {/* Template Image */}
            <h3 style={styles.sectionTitle}>Template Image:</h3>
            <div style={styles.fileUploadArea}>
              <input
                type="file"
                onChange={handleTemplateFileChange}
                ref={templateFileInputRef}
                style={styles.hiddenFileInput}
                accept="image/*"
              />
              <button 
                style={styles.chooseFileButton}
                onClick={() => templateFileInputRef.current?.click()}
              >
                CHOOSE FILE
              </button>
              <span style={styles.fileStatus}>
                {templateFile ? templateFile.name : 'No file chosen'}
              </span>
            </div>
          </div>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <button
            style={{
              ...styles.uploadButton,
              opacity: uploading ? 0.7 : 1,
              pointerEvents: uploading ? 'none' : 'auto',
            }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'UPLOADING...' : 'UPLOAD PCB'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CapturePCBPage;
