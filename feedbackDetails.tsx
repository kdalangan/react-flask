import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Instead of useRouter
import { useParams } from 'react-router-dom'; // Same name but different package


// Removed unused 'navItems' declaration to resolve the error.
interface DefectDetail {
  type: string;
  count: number;
  impact: string;
  solution: string;
}

const defectTypes: Record<string, DefectDetail> = {
  mousebite: {
    type: 'mousebite',
    count: 2,
    impact: 'Possible Leak Paths.',
    solution: 'Verify that all vias are properly filled and sealed.',
  },
  scratch: {
    type: 'scratch',
    count: 3,
    impact: 'Signal Integrity Issues.',
    solution: 'Polish affected areas and apply protective coating.',
  },
  shortcircuit: {
    type: 'shortcircuit',
    count: 1,
    impact: 'Component Failure Risk.',
    solution: 'Remove conductive debris and reapply solder mask.',
  },
  opencircuit: {
    type: 'opencircuit',
    count: 4,
    impact: 'Connection Failure.',
    solution: 'Rework affected traces with conductive material.',
  }
};

const FeedbackDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedDefect, setSelectedDefect] = useState<DefectDetail | null>(null);
  const [similarityScore, setScore] = useState<number>(100);
  const [grade, setGrade] = useState<string>('A');

  useEffect(() => {
    // Get the defect type from the URL parameter
    const defectType = params?.defectType as string || '';
    
    if (defectType && defectTypes[defectType]) {
      setSelectedDefect(defectTypes[defectType]);
      
      // Set a default similarity score based on the defect count
      const count = defectTypes[defectType].count;
      let newScore = 100;
      let newGrade = 'A';
      
      if (count > 3) {
        newScore = 20;
        newGrade = 'C';
      } else if (count > 1) {
        newScore = 50;
        newGrade = 'B';
      }
      
      setScore(newScore);
      setGrade(newGrade);
    }
  }, [params]);

  const handleGoBack = () => {
    navigate('/feedback');
  };

  const getGradeColor = () => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-orange-500';
      case 'C': return 'text-red-600';
      default: return 'text-gray-800';
    }
  };

  const getSimilarityColor = () => {
    if (similarityScore >= 80) return 'text-green-600';
    if (similarityScore >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
              <span className="font-bold text-black">PX</span>
            </div>
            <span className="font-bold text-xl">PXRT</span>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 rounded-md">HOME</button>
            <button className="px-4 py-2 rounded-md">CAPTURE or UPLOAD PCB</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm font-medium">FEEDBACK</button>
            <button className="px-4 py-2 rounded-md">SIMULATE CONTINUITY</button>
          </div>
        </div>
      </div>
      
      {/* Yellow Separator Line */}
      <div className="h-1 bg-yellow-500 w-full"></div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-200 rounded-md font-medium flex items-center"
        >
          <span className="mr-2">←</span> Back to All Defects
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-8">
        {/* Left Panel - Highlighted Differences */}
        <div>
          <div className="bg-yellow-500 h-64 w-full rounded-md shadow-md mb-6"></div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">HIGHLIGHTED DIFFERENCES</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-bold mr-2">SIMILARITY:</span>
              <span className={`font-bold ${getSimilarityColor()}`}>{similarityScore}%</span>
              <span className="ml-auto font-bold">GRADE:</span>
              <span className={`font-bold ml-2 ${getGradeColor()}`}>{grade}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-bold mr-2">SIMILARITY:</span>
                <span className="font-bold text-green-600">100%</span>
                <span className="ml-auto font-bold">GRADE:</span>
                <span className="font-bold ml-2 text-green-600">A</span>
              </div>
              
              <div className="flex items-center">
                <span className="font-bold mr-2">SIMILARITY:</span>
                <span className="font-bold text-orange-500">50%</span>
                <span className="ml-auto font-bold">GRADE:</span>
                <span className="font-bold ml-2 text-orange-500">B</span>
              </div>
              
              <div className="flex items-center">
                <span className="font-bold mr-2">SIMILARITY:</span>
                <span className="font-bold text-red-600">20%</span>
                <span className="ml-auto font-bold">GRADE:</span>
                <span className="font-bold ml-2 text-red-600">C</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Errors Detected */}
        <div>
          <div className="bg-yellow-500 h-64 w-full rounded-md shadow-md mb-6"></div>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-red-600">ERRORS DETECTED</h2>
            <div className="ml-auto">
              <select className="bg-gray-600 text-white px-3 py-1 rounded-sm">
                <option value="mousebite">MOUSEBITE</option>
                <option value="scratch">SCRATCH</option>
                <option value="shortcircuit">SHORTCIRCUIT</option>
                <option value="opencircuit">OPENCIRCUIT</option>
              </select>
            </div>
          </div>

          {selectedDefect && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl text-blue-600 font-bold">
                  {selectedDefect.count} {selectedDefect.type}(s) detected
                </h3>
              </div>
              
              <div className="flex items-center">
                <span className="text-red-600 font-bold mr-2">Impact:</span>
                <span className="font-medium">{selectedDefect.impact}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-green-600 font-bold mr-2">Solution:</span>
                <span className="font-medium">{selectedDefect.solution}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;