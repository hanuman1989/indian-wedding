'use client'
import Link from 'next/link'
import { Heart } from '@/components/Icons'
import { useUserAuth } from '@/hooks/useUserAuth'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import LoginForm from '@/components/login/LoginForm'

export default function HostCTA() {
  const { isAuthenticated } = useUserAuth()
    const { isOpen, openModal, closeModal } = useModal()

    const handleBecomeHostClick = (event) => {
      if (!isAuthenticated) {
        event.preventDefault()
        openModal()
      }
    }
  return (
    <section className="celeb_main relative overflow-hidden bg-white py-12 sm:py-14">
      <div className="shell flex flex-col items-center justify-center gap-6 text-center lg:flex-row">
        <div>
          <h2 className="font-display text-[22px] font-bold text-wine-700 sm:text-[20px] md:text-[20px]">
            Your Wedding Deserves to Be Celebrated
          </h2>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-wine-700">
            Share your love, welcoming guests from around the world to be part of your special
            day.
          </p>
          <Link
            href="/post-weddings"
            onClick={handleBecomeHostClick}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-gold-400 px-5 py-3 text-[13px] font-semibold text-wine-900 transition-colors hover:bg-gold-300"
          >
            Become a Host
          </Link>
        </div>

        {/* <p className="hidden items-center gap-2 font-display text-[15px] italic text-cream-100/70 lg:flex">
          More than a wedding, a shared joy
          <Heart className="h-4 w-4 text-gold-400" />
        </p> */}
         <Modal isOpen={isOpen} onClose={closeModal} size="3xl" noPadding>
                <LoginForm onClose={closeModal} />
              </Modal>
      </div>
    </section>
  )
}
