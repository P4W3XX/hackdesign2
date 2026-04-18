"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {/* Kontakt Section */}
          <div className="space-y-4">
            <div className="inline-block">
              <h3 className="border-b-2 border-green-600 pb-2 text-lg font-bold text-gray-900 md:text-xl">
                Kontakt
              </h3>
            </div>

            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-lg text-green-600">
                  📍
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Miejski Zakład Komunalny Sp. z o.o. w Leżajsku
                  </p>
                  <p className="text-gray-600">
                    ul. Zwirki i Wigury 3<br />
                    37-300 Leżajsk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-lg text-green-600">📧</span>
                <a
                  href="mailto:mzklezajsk@mzklezajsk.pl"
                  className="font-medium text-blue-600 transition hover:text-blue-800"
                >
                  mzklezajsk@mzklezajsk.pl
                </a>
              </div>
            </div>
          </div>

          {/* Telefony Alarmowe Section */}
          <div className="space-y-4">
            <div className="inline-block">
              <h3 className="border-b-2 border-green-600 pb-2 text-lg font-bold text-gray-900 md:text-xl">
                Telefony Alarmowe
              </h3>
            </div>

            <div className="space-y-3 rounded-lg md:p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-lg text-green-600">
                  🕐
                </span>
                <div className="text-sm md:text-base">
                  <p className="mb-2 font-semibold text-gray-900">
                    Pogotowie wodociągowe
                  </p>
                  <div className="space-y-1 text-gray-700">
                    <p>
                      <a
                        href="tel:+48172421432"
                        className="font-semibold text-blue-600 transition hover:text-blue-800"
                      >
                        tel. +48 17 242 14 32
                      </a>
                    </p>
                    <p className="text-gray-600">kom. 691 408 794</p>
                    <p className="mt-2 text-xs text-gray-600 md:text-sm">
                      Dostępne w godz. 23:00 do 6:00 oraz
                      <br />
                      niedziela i święta: tel. 605 785 347
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* O nas / Info Section */}
          <div className="space-y-4">
            <div className="inline-block">
              <h3 className="border-b-2 border-green-600 pb-2 text-lg font-bold text-gray-900 md:text-xl">
                O Nas
              </h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600 md:text-base">
              <p>
                MZK Leżajsk to nowoczesne przedsiębiorstwo zajmujące się
                zarządzaniem odpadami w Leżajsku i okolicach.
              </p>
              <p>
                Nasze systemy płatności i śledzenia odbioru odpadów ułatwiają
                Twoją codzienną obsługę.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-sm md:text-left">
              <p>© 2026 MZK Leżajsk</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="transition hover:text-green-400">
                Polityka prywatności
              </Link>
              <Link href="#" className="transition hover:text-green-400">
                Regulamin
              </Link>
              <Link href="#" className="transition hover:text-green-400">
                RODO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
