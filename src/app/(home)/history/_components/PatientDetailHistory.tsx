import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, FileText, Syringe, AlertCircle } from "lucide-react";

// Define the Treatment interface to match the one in PatientHistory
interface Treatment {
  treatmentId: string;
  patientName: string;
  severity: string;
  createdAt: string;
  notes: string;
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
              <Badge 
                className={`${getSeverityColor(selectedTreatment.severity)} px-3 py-1`}
              >
                {selectedTreatment.severity} Severity
              </Badge>
            </div>
          </div>

          {/* Treatment ID and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Treatment ID</p>
                <p className="text-sm font-medium">{selectedTreatment.treatmentId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="text-right">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium">
                  {new Date(selectedTreatment.createdAt).toLocaleDateString()}
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