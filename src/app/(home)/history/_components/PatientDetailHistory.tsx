import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, FileText, Syringe, AlertCircle, Heart, Hospital, ArrowRightCircle, ArrowLeftCircle } from "lucide-react";

// Define the Treatment interface to match the one in PatientHistory
interface Treatment {
  treatmentId: string;
  patientName: string;
  severity: string;
  createdAt: string;
  notes: string;
  leaveNotes: string | null;
  bloodPressure: string | null;
  forwardedByHospital: boolean;
  forwardedToHospital: boolean;
  medicines: { 
    medicineName: string; 
    medicineCount: number;
  }[];
  illnesses?: { 
    illnessId: string;
    illnessName: string; 
    illnessType: string; 
    illnessDescription: string;
  }[] | null;
}

// Update the props type
interface TreatmentDetailsDialogProps {
  selectedTreatment: Treatment | null;
  onClose: () => void;
}

const TreatmentDetailsDialog: React.FC<TreatmentDetailsDialogProps> = ({ 
  selectedTreatment, 
  onClose 
}) => {
  if (!selectedTreatment) return null;

  const getSeverityColor = (severity: any) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


    const getSeverityBadge = (severity:any) => {
      switch(severity.toUpperCase()) {
        case 'MILD':
          return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">No Rest Required</Badge>;
        case 'MODERATE':
          return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maybe Rest Required</Badge>;
        case 'SEVERE':
          return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rest Required</Badge>;
        default:
          return <Badge variant="outline">{severity}</Badge>;
      }
    };
  

  return (
    <Dialog open={!!selectedTreatment} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <span>Treatment Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 p-2">
          {/* Patient and Treatment Overview */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Patient Name</p>
              <h2 className="font-bold text-lg">{selectedTreatment.patientName}</h2>
            </div>
            <div className="text-right">
              {getSeverityBadge(selectedTreatment.severity)}
            </div>
          </div>
          {/* Leave Notes for Moderate/Severe Cases */}
          {(selectedTreatment.severity.toLowerCase() === 'moderate' || 
            selectedTreatment.severity.toLowerCase() === 'severe') && 
            selectedTreatment.leaveNotes && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Leave Notes</h3>
                <p className="text-sm text-orange-700">{selectedTreatment.leaveNotes}</p>
              </div>
          )}

          {/* Hospital Transfer Status */}
          {(selectedTreatment.forwardedByHospital || selectedTreatment.forwardedToHospital) && (
            <div className="bg-purple-50 rounded-lg p-3 flex flex-col space-y-2">
              <h3 className="font-semibold text-purple-800 flex items-center">
                <Hospital className="w-5 h-5 mr-2" />
                Hospital Transfer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTreatment.forwardedByHospital && (
                  <div className="flex items-center space-x-2">
                    <ArrowLeftCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-700">Forwarded by Hospital</span>
                  </div>
                )}
                {selectedTreatment.forwardedToHospital && (
                  <div className="flex items-center space-x-2">
                    <ArrowRightCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-700">Forwarded to Hospital</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Treatment ID, Date and Blood Pressure in a row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Treatment ID</p>
                <p className="text-sm font-medium">{selectedTreatment.treatmentId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium">
                  {new Date(selectedTreatment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  {new Date(selectedTreatment.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <Heart className="w-5 h-5 text-red-500" />
              <div className="text-right">
                <p className="text-xs text-gray-500">Blood Pressure</p>
                <p className="text-sm font-medium">
                  {selectedTreatment.bloodPressure || 'Not recorded'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {selectedTreatment.notes && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
              <p className="text-sm text-blue-800">{selectedTreatment.notes}</p>
            </div>
          )}

          {/* Medicines */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Syringe className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-700">Medicines</h3>
            </div>
            <div className="space-y-2">
              {selectedTreatment.medicines.map((medicine, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 rounded-md p-2 flex justify-between items-center"
                >
                  <span className="text-sm">{medicine.medicineName}</span>
                  <Badge variant="secondary">
                    {medicine.medicineCount}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Illnesses */}
          {selectedTreatment.illnesses && selectedTreatment.illnesses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Illnesses</h3>
              <div className="space-y-2">
                {selectedTreatment.illnesses.map((illness) => (
                  <div 
                    key={illness.illnessId} 
                    className="bg-red-50 border-l-4 border-red-500 p-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-red-800">
                        {illness.illnessName}
                      </span>
                      <Badge variant="destructive" className="ml-2">
                        {illness.illnessType}
                      </Badge>
                    </div>
                    {illness.illnessDescription && (
                      <p className="text-sm text-red-600 mt-1">
                        {illness.illnessDescription}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreatmentDetailsDialog;