import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function SafetyVerdict({ admet }) {
  return (
    <div style={{ 
      marginTop: '30px', padding: '20px', 
      background: admet.is_safe ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 0, 85, 0.1)', 
      borderRadius: '12px', 
      borderLeft: `4px solid ${admet.is_safe ? '#00ff66' : '#ff0055'}` 
    }}>
      <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {admet.is_safe ? <CheckCircle size={18} color="#00ff66"/> : <AlertTriangle size={18} color="#ff0055"/>}
        AI SAFETY VERDICT: {admet.is_safe ? "APPROVED" : "WARNING"}
      </div>
      <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5' }}>
        {admet.is_safe ? 
          "This molecule passes Lipinski's Rule of 5 and has a good QED score. It is likely safe for oral administration." : 
          "This molecule violates drug-likeness rules. It may have toxicity issues or poor absorption in the human body."
        }
      </div>
    </div>
  );
}