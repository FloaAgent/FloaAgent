import { Spinner } from "@heroui/spinner";

export function Loading() {
  return (
    <div className="h-[100%] w-[100%] absolute z-11 top-0 left-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Spinner
          classNames={{
            circle1: "border-b-primary",
            circle2: "border-b-primary",
          }}
          color="primary"
          size="lg"
        />
        <p className="text-sm text-default-600 animate-pulse">loading...</p>
      </div>
    </div>
  );
}
