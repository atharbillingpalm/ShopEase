export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">This section is under development.<br />Coming in a future update!</p>
    </div>
  );
}