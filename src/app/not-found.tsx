import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 text-neutral-700 font-semibold text-xl">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-neutral-600 sm:text-base leading-relaxed">
            Maaf, profil atau demo konveksi yang Anda cari tidak ditemukan. Pastikan tautan yang Anda buka sudah benar.
          </p>
        </div>
        <div>
          <Link
            href="/demo/demo-generik"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-colors"
          >
            Lihat Demo Contoh
          </Link>
        </div>
      </div>
    </main>
  );
}

