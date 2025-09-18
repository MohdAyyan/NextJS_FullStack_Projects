import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SessionDetail } from '../medical-agent/[sessionId]/page';
import { Button } from '@/components/ui/button';
import momment from 'moment';

type Props={
    historyList: SessionDetail[];
}


function HistoryTable({historyList}: Props) {
  return (
    <div>
        <Table>
  <TableCaption>Previous Consultation Reports.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead >AI Medical Specialist</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {historyList.map((record,index)=>(
        <TableRow>
      <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
      <TableCell>{record.notes}</TableCell>
      <TableCell>{momment(new Date(record.createdOn)).fromNow() }</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="text-right">
          View Report
        </Button>

      </TableCell>
    </TableRow>
    ))}
    
  </TableBody>
</Table>

    </div>
  )
}

export default HistoryTable