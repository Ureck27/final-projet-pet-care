import { Loader } from '@/components/common/loader';

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <Loader size="lg" />
      <p className="mt-4 animate-pulse text-muted-foreground">
        Preparing your pet care experience...
      </p>
    </div>
  );
}
