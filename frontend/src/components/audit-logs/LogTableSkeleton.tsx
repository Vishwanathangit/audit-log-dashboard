export default function LogTableSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded-md w-full" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 bg-muted/65 rounded-md w-full" />
        ))}
      </div>
    </div>
  );
}
