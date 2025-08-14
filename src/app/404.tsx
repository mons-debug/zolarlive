import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="min-h-screen bg-blackish flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-display font-extrabold text-ink mb-4">404</h1>
        <div className="h-1 w-32 mx-auto mb-8 rounded-full bg-zolar-grad" />
        <p className="text-h3 font-bold text-ink-90 mb-4">Page Not Found</p>
        <p className="text-body text-ink-70 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-zolar-grad rounded-full text-black font-semibold hover:scale-105 transition-transform"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}


