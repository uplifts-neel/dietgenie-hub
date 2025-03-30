
import { useState } from "react";
import { useAppContext, Fee } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Calendar, CreditCard, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";

const Fees = () => {
  const { fees, members, updateFeeStatus } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort fees by payment date (newest first)
  const sortedFees = [...fees].sort(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );

  const filteredFees = sortedFees.filter(
    (fee) =>
      fee.memberName.toLowerCase().includes(search.toLowerCase()) ||
      fee.admissionNumber.includes(search)
  );

  const getStatusColor = (status: Fee["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400";
      case "Due":
        return "bg-yellow-500/20 text-yellow-400";
      case "Overdue":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: Fee["status"]) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Due":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "Overdue":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const handleUpdateStatus = (feeId: string, status: Fee["status"]) => {
    updateFeeStatus(feeId, status);
    toast.success(`Fee status updated to ${status}`);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Fees Management</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or admission number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-gray-400"
        />
      </div>

      {filteredFees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No fees records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFees.map((fee) => (
            <Card
              key={fee.id}
              className="glass-card border-none animate-fade-in cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => {
                setSelectedFee(fee);
                setIsDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{fee.memberName}</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-400">
                        {new Date(fee.paymentDate).toLocaleDateString()}
                      </p>
                      <span className="mx-2 text-gray-500">•</span>
                      <p className="text-xs text-gray-400">
                        Admission #{fee.admissionNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={`${getStatusColor(fee.status)} flex items-center`}>
                      {getStatusIcon(fee.status)}
                      {fee.status}
                    </Badge>
                    <p className="text-white font-medium mt-1">₹{fee.amount}</p>
                  </div>
                </div>
                
                <div className="mt-2 flex space-x-3 text-xs">
                  <span className="bg-coral-red/20 text-coral-red rounded-full px-2 py-0.5 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(fee.startDate).toLocaleDateString()} - {new Date(fee.endDate).toLocaleDateString()}
                  </span>
                  <span className="bg-turquoise/20 text-turquoise rounded-full px-2 py-0.5">
                    {fee.feeType}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Fee Details Dialog */}
      {selectedFee && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-none max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-center">Fee Details</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h3 className="text-lg text-white font-medium mb-2">Member Details</h3>
              <p className="text-white/80">Name: {selectedFee.memberName}</p>
              <p className="text-white/80">Admission: {selectedFee.admissionNumber}</p>
              <p className="text-white/80">Fee Type: {selectedFee.feeType}</p>
              <p className="text-white/80">Amount: ₹{selectedFee.amount}</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h3 className="text-lg text-white font-medium mb-2">Date Details</h3>
              <p className="text-white/80">
                Payment Date: {new Date(selectedFee.paymentDate).toLocaleDateString()}
              </p>
              <p className="text-white/80">
                Period: {new Date(selectedFee.startDate).toLocaleDateString()} - {new Date(selectedFee.endDate).toLocaleDateString()}
              </p>
              <p className="text-white/80">
                Status: 
                <Badge className={`${getStatusColor(selectedFee.status)} ml-2 flex items-center`}>
                  {getStatusIcon(selectedFee.status)}
                  {selectedFee.status}
                </Badge>
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-lg text-white font-medium">Update Status</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className={`bg-green-500/20 text-green-400 hover:bg-green-500/30 ${selectedFee.status === 'Paid' ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => handleUpdateStatus(selectedFee.id, "Paid")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Paid
                </Button>
                <Button
                  variant="outline"
                  className={`bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 ${selectedFee.status === 'Due' ? 'ring-2 ring-yellow-500' : ''}`}
                  onClick={() => handleUpdateStatus(selectedFee.id, "Due")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Due
                </Button>
                <Button
                  variant="outline"
                  className={`bg-red-500/20 text-red-400 hover:bg-red-500/30 ${selectedFee.status === 'Overdue' ? 'ring-2 ring-red-500' : ''}`}
                  onClick={() => handleUpdateStatus(selectedFee.id, "Overdue")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Overdue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Fees;
