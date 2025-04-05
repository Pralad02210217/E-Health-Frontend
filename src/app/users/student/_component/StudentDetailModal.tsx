import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, Calendar } from "lucide-react";
import { format } from 'date-fns';

// Define a simplified Treatment interface based on your needs
interface Treatment {
    patientName: string;
    studentNumber: string; // Assuming this exists in your treatment data
    severity: string;
    createdAt: string;
}

interface TreatmentDetailsDialogProps {
    open: boolean; // Add this prop
    selectedTreatment: Treatment | null;
    onClose: () => void;
}

const StudentTreatmentDetailsDialog: React.FC<TreatmentDetailsDialogProps> = ({
    open,
    selectedTreatment,
    onClose
}) => {
    if (!selectedTreatment) return null;

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'mild': return 'bg-green-100 text-green-800';
            case 'moderate': return 'bg-yellow-100 text-yellow-800';
            case 'severe': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formattedDate = format(new Date(selectedTreatment.createdAt), 'MMMM d, yyyy');
    const formattedTime = format(new Date(selectedTreatment.createdAt), 'h:mm a');

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <span>Visit Details</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Patient Name and Severity */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Patient Name</p>
                            <h2 className="font-bold text-lg">{selectedTreatment.patientName}</h2>
                        </div>
                        <Badge className={`${getSeverityColor(selectedTreatment.severity)} px-3 py-1`}>
                            {selectedTreatment.severity}
                        </Badge>
                    </div>

                    {/* Student Number */}
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Student Number</p>
                            <p className="text-sm font-medium">{selectedTreatment.studentNumber}</p>
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Visit Date</p>
                                <p className="text-sm font-medium">{formattedDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* You could add a clock icon here if you have one */}
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Visit Time</p>
                                <p className="text-sm font-medium">{formattedTime}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StudentTreatmentDetailsDialog;