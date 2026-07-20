import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function LogTableSkeleton() {
  const rowCount = 10;
  
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center font-semibold text-foreground">S.No</TableHead>
            <TableHead className="w-45 font-semibold text-foreground">Timestamp</TableHead>
            <TableHead className="font-semibold text-foreground">Actor</TableHead>
            <TableHead className="font-semibold text-foreground">Role</TableHead>
            <TableHead className="font-semibold text-foreground">Action</TableHead>
            <TableHead className="font-semibold text-foreground">Resource</TableHead>
            <TableHead className="font-semibold text-foreground">Type</TableHead>
            <TableHead className="font-semibold text-foreground">IP Address</TableHead>
            <TableHead className="font-semibold text-foreground">Region</TableHead>
            <TableHead className="font-semibold text-foreground">Severity</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="w-25 text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              <TableCell className="text-center">
                <Skeleton className="h-4 w-6 mx-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-35" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-27.5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32.5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-17.5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-25" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16.25 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-18.75 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-20 ml-auto rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
